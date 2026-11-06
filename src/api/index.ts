import {
  PermissionDeniedError,
  defaultPolicy,
  type Actor,
  type Permission,
  type PermissionPolicy,
  type Relationship,
  type Resource,
} from './permissions';
import type { DataStore } from './store';
import type {
  Album,
  Audience,
  CrumbPhoto,
  DayLog,
  DayStop,
  FriendSummary,
  FriendshipState,
  GallerySection,
  Highlight,
  LinkedAccount,
  Preferences,
  SavedPlace,
  UserId,
  UserProfile,
  UserStats,
  WeekSummary,
} from './types';

export * from './types';
export * from './permissions';
export type { DataStore } from './store';

/** A pending friend request row. */
export interface FriendRequest {
  userId: UserId;
  name: string;
  handle: string;
  avatarPath: string | null;
}

export interface ApiOptions {
  store: DataStore;
  /** Defaults to the built-in policy; inject one to change authorization. */
  policy?: PermissionPolicy;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** Local date key (YYYY-MM-DD) in the environment's timezone. */
function localDateKey(d: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

/** Sunday of the week containing a YYYY-MM-DD key. */
function sundayOf(dateKey: string): string {
  const d = new Date(dateKey + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - d.getUTCDay());
  return d.toISOString().slice(0, 10);
}

function displayDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

/**
 * Build the Breadcrumbs data-access API over a DataStore.
 *
 * Every read/write takes an Actor (who is asking) and gates on the injected
 * PermissionPolicy. Today an Actor is just a user id; when Firebase Auth lands,
 * build the Actor from the signed-in user and pass it through - nothing in this
 * layer changes.
 */
export function createApi(options: ApiOptions) {
  const { store } = options;
  const policy = options.policy ?? defaultPolicy;

  async function relationship(actor: Actor, otherId: UserId): Promise<Relationship> {
    if (actor.userId === otherId) return 'self';
    const [blockedByMe, blockedByThem, fwd, rev] = await Promise.all([
      store.getBlock(actor.userId, otherId),
      store.getBlock(otherId, actor.userId),
      store.getFriendship(actor.userId, otherId),
      store.getFriendship(otherId, actor.userId),
    ]);
    if (blockedByMe || blockedByThem) return 'blocked';
    if (fwd?.status === 'accepted' || rev?.status === 'accepted') return 'friend';
    return 'stranger';
  }

  function assert(actor: Actor, permission: Permission, resource: Resource): void {
    if (!policy.can(actor, permission, resource)) {
      throw new PermissionDeniedError(permission, resource);
    }
  }

  type CrumbRow = {
    id: string;
    userId: UserId;
    placeName: string;
    city: string;
    visitedAt: Date;
    note: string | null;
    audience: Audience;
    photoIds: string[];
  };

  /** Crumbs of userId the actor is allowed to see. */
  async function visibleCrumbs(actor: Actor, userId: UserId): Promise<CrumbRow[]> {
    const rel = await relationship(actor, userId);
    const crumbs = await store.listCrumbs(userId);
    if (rel === 'self') return crumbs;
    if (rel === 'blocked') {
      assert(actor, 'crumbs:read', { ownerId: userId, relationship: rel });
      return [];
    }
    if (rel === 'friend') return crumbs.filter((c) => c.audience === 'friends');
    assert(actor, 'crumbs:read', { ownerId: userId, relationship: rel });
    return [];
  }

  async function daysLoggedFor(userId: UserId): Promise<number> {
    const crumbs = await store.listCrumbs(userId);
    return new Set(crumbs.map((c) => localDateKey(c.visitedAt))).size;
  }

  async function friendCountFor(userId: UserId): Promise<number> {
    const friendships = await store.listFriendships(userId);
    return friendships.filter((f) => f.status === 'accepted').length;
  }

  async function toPhoto(photoId: string): Promise<CrumbPhoto> {
    const p = await store.getPhoto(photoId);
    return { id: photoId, storagePath: p?.storagePath ?? null };
  }

  async function requestRows(
    reqs: { userId: UserId; friendId: UserId }[],
    otherField: 'userId' | 'friendId',
  ): Promise<FriendRequest[]> {
    const rows: FriendRequest[] = [];
    for (const r of reqs) {
      const otherId = r[otherField];
      const profile = await store.getUser(otherId);
      rows.push({
        userId: otherId,
        name: profile?.name ?? otherId,
        handle: profile?.handle ?? '',
        avatarPath: profile?.avatarPath ?? null,
      });
    }
    return rows;
  }

  // ---- users -----------------------------------------------------------

  const users = {
    async get(actor: Actor, userId: UserId): Promise<{ profile: UserProfile; stats: UserStats } | null> {
      const rel = await relationship(actor, userId);
      assert(actor, 'profile:read', { ownerId: userId, relationship: rel });
      const user = await store.getUser(userId);
      if (!user) return null;
      const [daysLogged, friendCount] = await Promise.all([daysLoggedFor(userId), friendCountFor(userId)]);
      return {
        profile: { id: user.id, name: user.name, handle: user.handle, bio: user.bio, avatarPath: user.avatarPath },
        stats: { daysLogged, friendCount },
      };
    },

    async update(actor: Actor, patch: { name?: string; handle?: string; bio?: string; avatarPath?: string | null }): Promise<void> {
      assert(actor, 'profile:write', { ownerId: actor.userId, relationship: 'self' });
      await store.updateUser(actor.userId, patch);
    },
  };

  // ---- friends ---------------------------------------------------------

  const friends = {
    /** Accepted friends of userId with derived activity counts. */
    async list(actor: Actor, userId: UserId): Promise<FriendSummary[]> {
      const rel = await relationship(actor, userId);
      assert(actor, 'friends:read', { ownerId: userId, relationship: rel });
      const friendships = await store.listFriendships(userId);
      const accepted = friendships.filter((f) => f.status === 'accepted');
      const weekAgo = Date.now() - WEEK_MS;
      const rows: FriendSummary[] = [];
      for (const f of accepted) {
        const [profile, crumbs] = await Promise.all([store.getUser(f.friendId), store.listCrumbs(f.friendId)]);
        rows.push({
          id: f.friendId,
          name: profile?.name ?? f.friendId,
          handle: profile?.handle ?? '',
          avatarPath: profile?.avatarPath ?? null,
          places: crumbs.length,
          newPlaces: crumbs.filter((c) => c.visitedAt.getTime() >= weekAgo).length,
        });
      }
      return rows;
    },

    /** The actor's relationship to another user. */
    async status(actor: Actor, otherId: UserId): Promise<FriendshipState> {
      if (actor.userId === otherId) return { kind: 'self' };
      const [blockedByMe, blockedByThem, fwd, rev] = await Promise.all([
        store.getBlock(actor.userId, otherId),
        store.getBlock(otherId, actor.userId),
        store.getFriendship(actor.userId, otherId),
        store.getFriendship(otherId, actor.userId),
      ]);
      if (blockedByMe && blockedByThem) return { kind: 'blocked', blockedBy: 'both' };
      if (blockedByMe) return { kind: 'blocked', blockedBy: 'you' };
      if (blockedByThem) return { kind: 'blocked', blockedBy: 'them' };
      if (fwd?.status === 'accepted' || rev?.status === 'accepted') return { kind: 'accepted' };
      if (fwd?.status === 'pending') return { kind: 'pending', direction: 'outgoing' };
      if (rev?.status === 'pending') return { kind: 'pending', direction: 'incoming' };
      return { kind: 'none' };
    },

    async request(actor: Actor, receiverId: UserId): Promise<void> {
      if (actor.userId === receiverId) throw new Error('Cannot send a friend request to yourself');
      const now = new Date();
      await store.setFriendship(actor.userId, receiverId, {
        userId: actor.userId,
        friendId: receiverId,
        status: 'pending',
        requestedBy: actor.userId,
        createdAt: now,
        updatedAt: now,
      });
    },

    async accept(actor: Actor, requesterId: UserId): Promise<void> {
      const forward = await store.getFriendship(requesterId, actor.userId);
      if (!forward || forward.status !== 'pending') {
        throw new Error('No pending request from ' + requesterId);
      }
      const now = new Date();
      await store.setFriendship(requesterId, actor.userId, { ...forward, status: 'accepted', updatedAt: now });
      await store.setFriendship(actor.userId, requesterId, {
        userId: actor.userId,
        friendId: requesterId,
        status: 'accepted',
        requestedBy: requesterId,
        createdAt: forward.createdAt,
        updatedAt: now,
      });
    },

    async unfriend(actor: Actor, otherId: UserId): Promise<void> {
      await store.deleteFriendship(actor.userId, otherId);
      await store.deleteFriendship(otherId, actor.userId);
    },

    async block(actor: Actor, otherId: UserId): Promise<void> {
      await store.setBlock(actor.userId, otherId, {
        blockerId: actor.userId,
        blockedId: otherId,
        createdAt: new Date(),
      });
      await store.deleteFriendship(actor.userId, otherId);
      await store.deleteFriendship(otherId, actor.userId);
    },

    async unblock(actor: Actor, otherId: UserId): Promise<void> {
      await store.deleteBlock(actor.userId, otherId);
    },

    /** Pending requests where userId is the receiver. */
    async incoming(userId: UserId): Promise<FriendRequest[]> {
      const reqs = await store.listFriendshipsTo(userId);
      return requestRows(reqs.filter((f) => f.status === 'pending'), 'userId');
    },

    /** Pending requests where userId is the sender. */
    async outgoing(userId: UserId): Promise<FriendRequest[]> {
      const reqs = await store.listFriendships(userId);
      return requestRows(reqs.filter((f) => f.status === 'pending'), 'friendId');
    },

    /** Most recent shared crumb for each accepted friend of userId. */
    async highlights(actor: Actor, userId: UserId): Promise<Highlight[]> {
      const rel = await relationship(actor, userId);
      assert(actor, 'friends:read', { ownerId: userId, relationship: rel });
      const friendships = await store.listFriendships(userId);
      const accepted = friendships.filter((f) => f.status === 'accepted');
      const out: Highlight[] = [];
      for (const f of accepted) {
        const crumbs = (await store.listCrumbs(f.friendId))
          .filter((c) => c.audience === 'friends')
          .sort((a, b) => b.visitedAt.getTime() - a.visitedAt.getTime());
        const latest = crumbs[0];
        if (!latest) continue;
        const firstPhotoId = latest.photoIds[0];
        out.push({
          id: latest.id,
          friendId: f.friendId,
          tag: latest.placeName,
          date: displayDate(latest.visitedAt),
          photo: firstPhotoId ? await toPhoto(firstPhotoId) : null,
        });
      }
      return out;
    },
  };

  // ---- crumbs ----------------------------------------------------------

  const crumbs = {
    /** A single day's aggregated log, derived from that day's crumbs. */
    async day(actor: Actor, userId: UserId, date: string): Promise<DayLog | null> {
      const all = await store.listCrumbs(userId);
      const matches = all
        .filter((c) => localDateKey(c.visitedAt) === date)
        .sort((a, b) => a.visitedAt.getTime() - b.visitedAt.getTime());
      if (matches.length === 0) return null;

      const rel = await relationship(actor, userId);
      const audience: Audience = matches.some((c) => c.audience === 'friends') ? 'friends' : 'private';
      assert(actor, 'crumbs:read', { ownerId: userId, relationship: rel, audience });

      const stops: DayStop[] = [];
      const photos: CrumbPhoto[] = [];
      for (const c of matches) {
        const firstPhotoId = c.photoIds[0];
        const photo = firstPhotoId ? await toPhoto(firstPhotoId) : null;
        stops.push({
          id: c.id,
          name: c.placeName,
          time: c.visitedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
          city: c.city,
          photoCount: c.photoIds.length,
          photo,
        });
        for (const pid of c.photoIds) photos.push(await toPhoto(pid));
      }

      return {
        date,
        location: matches[0].city,
        stops,
        photos,
        note: matches.find((c) => c.note)?.note ?? null,
        audience,
      };
    },

    /** Day-of-month numbers with a crumb, for calendar shading. */
    async daysForMonth(actor: Actor, userId: UserId, year: number, month: number): Promise<number[]> {
      const crumbs = await visibleCrumbs(actor, userId);
      const days = new Set<number>();
      for (const c of crumbs) {
        if (c.visitedAt.getFullYear() === year && c.visitedAt.getMonth() === month) {
          days.add(c.visitedAt.getDate());
        }
      }
      return [...days].sort((a, b) => a - b);
    },

    /** Most recent crumb photos, newest first. */
    async recentPhotos(actor: Actor, userId: UserId, limit = 4): Promise<CrumbPhoto[]> {
      const crumbs = (await visibleCrumbs(actor, userId)).sort(
        (a, b) => b.visitedAt.getTime() - a.visitedAt.getTime(),
      );
      const rows: CrumbPhoto[] = [];
      for (const c of crumbs) {
        for (const pid of c.photoIds) {
          rows.push(await toPhoto(pid));
          if (rows.length >= limit) return rows;
        }
      }
      return rows;
    },

    /** Weeks derived from the user's crumbs. */
    async weeks(actor: Actor, userId: UserId): Promise<WeekSummary[]> {
      const crumbs = await visibleCrumbs(actor, userId);
      const byWeek = new Map<string, Set<string>>();
      for (const c of crumbs) {
        const key = localDateKey(c.visitedAt);
        const ws = sundayOf(key);
        const set = byWeek.get(ws) ?? new Set<string>();
        set.add(key);
        byWeek.set(ws, set);
      }
      return [...byWeek.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([weekStartDate, set]) => ({ weekStartDate, dayKeys: [...set].sort() }));
    },
  };

  // ---- places ----------------------------------------------------------

  const places = {
    async saved(actor: Actor, userId: UserId): Promise<SavedPlace[]> {
      const rel = await relationship(actor, userId);
      assert(actor, 'places:read', { ownerId: userId, relationship: rel });
      const list = await store.listSavedPlaces(userId);
      return list.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.name,
        category: p.category,
        price: p.price,
        photoPath: p.photoPath,
      }));
    },

    async save(
      actor: Actor,
      input: { name: string; category: string; price: string; photoPath: string | null },
      id?: string,
    ): Promise<string> {
      assert(actor, 'places:write', { ownerId: actor.userId, relationship: 'self' });
      const savedId = id ?? 'sp_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      await store.setSavedPlace(savedId, {
        userId: actor.userId,
        name: input.name,
        category: input.category,
        price: input.price,
        photoPath: input.photoPath,
        createdAt: new Date(),
      });
      return savedId;
    },

    async remove(actor: Actor, placeId: string): Promise<void> {
      assert(actor, 'places:write', { ownerId: actor.userId, relationship: 'self' });
      const owned = (await store.listSavedPlaces(actor.userId)).some((p) => p.id === placeId);
      if (!owned) return;
      await store.deleteSavedPlace(placeId);
    },
  };

  // ---- gallery ---------------------------------------------------------

  const gallery = {
    /** Photos grouped under each place the user has visited. */
    async sections(actor: Actor, userId: UserId): Promise<GallerySection[]> {
      const crumbs = await visibleCrumbs(actor, userId);
      const groups = new Map<string, CrumbPhoto[]>();
      for (const c of crumbs) {
        for (const pid of c.photoIds) {
          const list = groups.get(c.placeName) ?? [];
          list.push(await toPhoto(pid));
          groups.set(c.placeName, list);
        }
      }
      return [...groups.entries()].map(([place, photos]) => ({ id: place, place, photos }));
    },

    async albums(actor: Actor, userId: UserId): Promise<Album[]> {
      const rel = await relationship(actor, userId);
      assert(actor, 'albums:read', { ownerId: userId, relationship: rel });
      const list = await store.listAlbums(userId);
      return list.map((a) => ({
        id: a.id,
        userId: a.userId,
        title: a.title,
        photoCount: a.photoIds.length,
        coverPhotoPath: a.coverPhotoPath,
      }));
    },
  };

  // ---- preferences -----------------------------------------------------

  const preferences = {
    async get(actor: Actor, userId: UserId): Promise<Preferences | null> {
      const rel = await relationship(actor, userId);
      assert(actor, 'preferences:read', { ownerId: userId, relationship: rel });
      const p = await store.getPreferences(userId);
      if (!p) return null;
      return {
        notifications: p.notifications,
        locationServices: p.locationServices,
        weeklyEmail: p.weeklyEmail,
        darkMode: p.darkMode,
      };
    },

    async update(actor: Actor, patch: Partial<Preferences>): Promise<void> {
      assert(actor, 'preferences:write', { ownerId: actor.userId, relationship: 'self' });
      const existing = (await store.getPreferences(actor.userId)) ?? {
        notifications: true,
        locationServices: true,
        weeklyEmail: false,
        darkMode: false,
      };
      await store.setPreferences(actor.userId, { ...existing, ...patch });
    },
  };

  // ---- linked accounts -------------------------------------------------

  const accounts = {
    async list(actor: Actor, userId: UserId): Promise<LinkedAccount[]> {
      const rel = await relationship(actor, userId);
      assert(actor, 'accounts:read', { ownerId: userId, relationship: rel });
      const list = await store.listLinkedAccounts(userId);
      return list.map((a) => ({ provider: a.provider, connected: a.connected }));
    },
  };

  return { users, friends, crumbs, places, gallery, preferences, accounts };
}

export type BreadcrumbsApi = ReturnType<typeof createApi>;
