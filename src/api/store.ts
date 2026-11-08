import type { Audience, UserId } from './types';

/**
 * Raw document data shapes. These are the Firestore field names and types.
 * Keep them in one place so the Firestore implementation (./firestore-store.ts)
 * and the in-memory test double (./testing/memory-store.ts) stay in lockstep.
 *
 * Firestore schema:
 *   users/{userId}
 *     name, handle, bio, avatarPath, email?
 *   friendships/{userId}_{friendId}   (directed; usernames ban '_')
 *     userId, friendId, status, requestedBy, createdAt, updatedAt
 *   blocks/{blockerId}_{blockedId}
 *     blockerId, blockedId, createdAt
 *   crumbs/{crumbId}                  (one logged place visit = one "stop")
 *     userId, placeName, city, visitedAt, note, audience, photoIds
 *   photos/{photoId}
 *     storagePath
 *   savedPlaces/{savedPlaceId}
 *     userId, name, category, price, photoPath, createdAt
 *   albums/{albumId}
 *     userId, title, coverPhotoPath, photoIds, createdAt
 *   preferences/{userId}
 *     notifications, locationServices, weeklyEmail, darkMode
 *   linkedAccounts/{userId}_{provider}
 *     userId, provider, connected, createdAt
 *
 * Days and weeks are NOT stored - they are read-time derivations of crumbs
 * grouped by the local date of visitedAt.
 */

export interface UserData {
  name: string;
  handle: string;
  bio: string;
  avatarPath: string | null;
  email?: string | null;
}

export interface FriendshipData {
  userId: UserId;
  friendId: UserId;
  status: 'pending' | 'accepted';
  requestedBy: UserId;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlockData {
  blockerId: UserId;
  blockedId: UserId;
  createdAt: Date;
}

export interface CrumbData {
  userId: UserId;
  placeName: string;
  city: string;
  visitedAt: Date;
  note: string | null;
  audience: Audience;
  photoIds: string[];
  latitude?: number | null;
  longitude?: number | null;
}

export interface PhotoData {
  storagePath: string | null;
}

export interface SavedPlaceData {
  userId: UserId;
  name: string;
  category: string;
  price: string;
  photoPath: string | null;
  createdAt: Date;
}

export interface AlbumData {
  userId: UserId;
  title: string;
  coverPhotoPath: string | null;
  photoIds: string[];
  createdAt: Date;
}

export interface PreferencesData {
  notifications: boolean;
  locationServices: boolean;
  weeklyEmail: boolean;
  darkMode: boolean;
}

export interface LinkedAccountData {
  provider: string;
  connected: boolean;
}

/** Deterministic, directed friendship/block document id. */
export function friendshipKey(a: UserId, b: UserId): string {
  return a + '_' + b;
}

/**
 * The storage seam the API layer talks to. This is a narrow, domain-shaped
 * interface - not a re-implementation of the Firestore SDK - so it is easy to
 * implement with Firestore (./firestore-store.ts) and easy to fake in tests
 * (./testing/memory-store.ts).
 */
export interface DataStore {
  // users
  getUser(userId: UserId): Promise<(UserData & { id: string }) | null>;
  setUser(userId: UserId, data: UserData): Promise<void>;
  updateUser(userId: UserId, patch: Partial<UserData>): Promise<void>;
  listUsers(): Promise<(UserData & { id: string })[]>;

  // friendships (directed docs)
  listFriendships(userId: UserId): Promise<FriendshipData[]>;
  listFriendshipsTo(friendId: UserId): Promise<FriendshipData[]>;
  getFriendship(a: UserId, b: UserId): Promise<FriendshipData | null>;
  setFriendship(a: UserId, b: UserId, data: FriendshipData): Promise<void>;
  deleteFriendship(a: UserId, b: UserId): Promise<void>;

  // blocks
  getBlock(blockerId: UserId, blockedId: UserId): Promise<BlockData | null>;
  setBlock(blockerId: UserId, blockedId: UserId, data: BlockData): Promise<void>;
  deleteBlock(blockerId: UserId, blockedId: UserId): Promise<void>;

  // crumbs
  listCrumbs(
    userId: UserId,
    opts?: { from?: Date; to?: Date },
  ): Promise<(CrumbData & { id: string })[]>;
  getCrumb(crumbId: string): Promise<(CrumbData & { id: string }) | null>;
  setCrumb(crumbId: string, data: CrumbData): Promise<void>;

  // photos
  getPhoto(photoId: string): Promise<PhotoData | null>;
  setPhoto(photoId: string, data: PhotoData): Promise<void>;

  // saved places
  listSavedPlaces(userId: UserId): Promise<(SavedPlaceData & { id: string })[]>;
  setSavedPlace(id: string, data: SavedPlaceData): Promise<void>;
  deleteSavedPlace(id: string): Promise<void>;

  // albums
  listAlbums(userId: UserId): Promise<(AlbumData & { id: string })[]>;

  // preferences
  getPreferences(userId: UserId): Promise<PreferencesData | null>;
  setPreferences(userId: UserId, data: PreferencesData): Promise<void>;

  // linked accounts
  listLinkedAccounts(userId: UserId): Promise<LinkedAccountData[]>;
  setLinkedAccount(userId: UserId, provider: string, data: LinkedAccountData): Promise<void>;
}
