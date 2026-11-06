import {
  friendshipKey,
  type AlbumData,
  type BlockData,
  type CrumbData,
  type DataStore,
  type FriendshipData,
  type LinkedAccountData,
  type PhotoData,
  type PreferencesData,
  type SavedPlaceData,
  type UserData,
} from '../store';

type WithId<T> = T & { id: string };

/**
 * In-memory DataStore used by tests. It implements the same narrow interface as
 * the Firestore store, so unit tests exercise the real API layer without any
 * network or Firebase SDK. Seed helpers make fixtures concise.
 */
export class MemoryStore implements DataStore {
  private users = new Map<string, UserData>();
  private friendships = new Map<string, FriendshipData>();
  private blocks = new Map<string, BlockData>();
  private crumbs = new Map<string, CrumbData>();
  private photos = new Map<string, PhotoData>();
  private savedPlaces = new Map<string, SavedPlaceData>();
  private albums = new Map<string, AlbumData>();
  private preferences = new Map<string, PreferencesData>();
  private linkedAccounts = new Map<string, LinkedAccountData>();

  // ---- seed helpers ----------------------------------------------------

  user(id: string, data: Partial<UserData> = {}): this {
    this.users.set(id, {
      name: data.name ?? id,
      handle: data.handle ?? '@' + id,
      bio: data.bio ?? '',
      avatarPath: data.avatarPath ?? null,
      email: data.email ?? null,
    });
    return this;
  }

  friendship(a: string, b: string, status: 'pending' | 'accepted' = 'accepted', requestedBy: string = a): this {
    const now = new Date();
    this.friendships.set(friendshipKey(a, b), {
      userId: a,
      friendId: b,
      status,
      requestedBy,
      createdAt: now,
      updatedAt: now,
    });
    return this;
  }

  block(blockerId: string, blockedId: string): this {
    this.blocks.set(friendshipKey(blockerId, blockedId), {
      blockerId,
      blockedId,
      createdAt: new Date(),
    });
    return this;
  }

  crumb(id: string, data: Partial<CrumbData> & { userId: string }): this {
    this.crumbs.set(id, {
      placeName: data.placeName ?? id,
      city: data.city ?? 'Pittsburgh',
      visitedAt: data.visitedAt ?? new Date(),
      note: data.note ?? null,
      audience: data.audience ?? 'private',
      photoIds: data.photoIds ?? [],
      userId: data.userId,
    });
    return this;
  }

  photo(id: string, storagePath: string | null = null): this {
    this.photos.set(id, { storagePath });
    return this;
  }

  savedPlace(id: string, data: Partial<SavedPlaceData> & { userId: string }): this {
    this.savedPlaces.set(id, {
      name: data.name ?? id,
      category: data.category ?? 'Other',
      price: data.price ?? '$',
      photoPath: data.photoPath ?? null,
      createdAt: data.createdAt ?? new Date(),
      userId: data.userId,
    });
    return this;
  }

  album(id: string, data: Partial<AlbumData> & { userId: string }): this {
    this.albums.set(id, {
      title: data.title ?? id,
      coverPhotoPath: data.coverPhotoPath ?? null,
      photoIds: data.photoIds ?? [],
      createdAt: data.createdAt ?? new Date(),
      userId: data.userId,
    });
    return this;
  }

  prefs(userId: string, data: Partial<PreferencesData> = {}): this {
    this.preferences.set(userId, {
      notifications: data.notifications ?? true,
      locationServices: data.locationServices ?? true,
      weeklyEmail: data.weeklyEmail ?? false,
      darkMode: data.darkMode ?? false,
    });
    return this;
  }

  linkedAccount(userId: string, provider: string, connected = true): this {
    this.linkedAccounts.set(userId + '_' + provider, { provider, connected });
    return this;
  }

  // ---- users -----------------------------------------------------------

  async getUser(userId: string): Promise<WithId<UserData> | null> {
    const data = this.users.get(userId);
    return data ? { id: userId, ...data } : null;
  }

  async setUser(userId: string, data: UserData): Promise<void> {
    this.users.set(userId, { ...data });
  }

  async updateUser(userId: string, patch: Partial<UserData>): Promise<void> {
    const existing = this.users.get(userId);
    if (!existing) return;
    this.users.set(userId, { ...existing, ...patch });
  }

  // ---- friendships -----------------------------------------------------

  async listFriendships(userId: string): Promise<FriendshipData[]> {
    return [...this.friendships.values()].filter((f) => f.userId === userId);
  }

  async listFriendshipsTo(friendId: string): Promise<FriendshipData[]> {
    return [...this.friendships.values()].filter((f) => f.friendId === friendId);
  }

  async getFriendship(a: string, b: string): Promise<FriendshipData | null> {
    return this.friendships.get(friendshipKey(a, b)) ?? null;
  }

  async setFriendship(a: string, b: string, data: FriendshipData): Promise<void> {
    this.friendships.set(friendshipKey(a, b), { ...data });
  }

  async deleteFriendship(a: string, b: string): Promise<void> {
    this.friendships.delete(friendshipKey(a, b));
  }

  // ---- blocks ----------------------------------------------------------

  async getBlock(blockerId: string, blockedId: string): Promise<BlockData | null> {
    return this.blocks.get(friendshipKey(blockerId, blockedId)) ?? null;
  }

  async setBlock(blockerId: string, blockedId: string, data: BlockData): Promise<void> {
    this.blocks.set(friendshipKey(blockerId, blockedId), { ...data });
  }

  async deleteBlock(blockerId: string, blockedId: string): Promise<void> {
    this.blocks.delete(friendshipKey(blockerId, blockedId));
  }

  // ---- crumbs ----------------------------------------------------------

  async listCrumbs(
    userId: string,
    opts?: { from?: Date; to?: Date },
  ): Promise<WithId<CrumbData>[]> {
    return [...this.crumbs.entries()]
      .filter(([, c]) => {
        if (c.userId !== userId) return false;
        if (opts?.from && c.visitedAt < opts.from) return false;
        if (opts?.to && c.visitedAt > opts.to) return false;
        return true;
      })
      .map(([id, c]) => ({ id, ...c }))
      .sort((a, b) => a.visitedAt.getTime() - b.visitedAt.getTime());
  }

  async getCrumb(crumbId: string): Promise<WithId<CrumbData> | null> {
    const data = this.crumbs.get(crumbId);
    return data ? { id: crumbId, ...data } : null;
  }

  // ---- photos ----------------------------------------------------------

  async getPhoto(photoId: string): Promise<PhotoData | null> {
    return this.photos.get(photoId) ?? null;
  }

  // ---- saved places ----------------------------------------------------

  async listSavedPlaces(userId: string): Promise<WithId<SavedPlaceData>[]> {
    return [...this.savedPlaces.entries()]
      .filter(([, p]) => p.userId === userId)
      .map(([id, p]) => ({ id, ...p }));
  }

  async setSavedPlace(id: string, data: SavedPlaceData): Promise<void> {
    this.savedPlaces.set(id, { ...data });
  }

  async deleteSavedPlace(id: string): Promise<void> {
    this.savedPlaces.delete(id);
  }

  // ---- albums ----------------------------------------------------------

  async listAlbums(userId: string): Promise<WithId<AlbumData>[]> {
    return [...this.albums.entries()]
      .filter(([, a]) => a.userId === userId)
      .map(([id, a]) => ({ id, ...a }));
  }

  // ---- preferences -----------------------------------------------------

  async getPreferences(userId: string): Promise<PreferencesData | null> {
    return this.preferences.get(userId) ?? null;
  }

  async setPreferences(userId: string, data: PreferencesData): Promise<void> {
    this.preferences.set(userId, { ...data });
  }

  // ---- linked accounts -------------------------------------------------

  async listLinkedAccounts(userId: string): Promise<LinkedAccountData[]> {
    return [...this.linkedAccounts.entries()]
      .filter(([key]) => key.startsWith(userId + '_'))
      .map(([, a]) => a);
  }

  async setLinkedAccount(userId: string, provider: string, data: LinkedAccountData): Promise<void> {
    this.linkedAccounts.set(userId + '_' + provider, { ...data });
  }
}
