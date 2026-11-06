/**
 * Breadcrumbs domain types.
 *
 * These are the data shapes the API layer returns. They are deliberately
 * decoupled from two things:
 *   - the UI mock types in src/data (which hold expo-image sources and crops)
 *   - the Firestore document shapes in ./store.ts
 *
 * Photos are represented as Cloud Storage paths (or null when missing) so the
 * data layer has no dependency on expo-image or require(). The UI resolves a
 * path to an <Image> source when it renders.
 */

export type UserId = string;

export type FriendshipStatus = 'pending' | 'accepted';

export type Audience = 'private' | 'friends';

/** Profile fields safe to show for any user id. */
export interface UserProfile {
  id: UserId;
  name: string;
  handle: string;
  bio: string;
  avatarPath: string | null;
}

/** Derived account statistics. */
export interface UserStats {
  /** Distinct calendar days with at least one crumb. */
  daysLogged: number;
  /** Number of accepted friendships. */
  friendCount: number;
}

/** A single place visit - one crumb / little stop on a day's trail. */
export interface Crumb {
  id: string;
  userId: UserId;
  placeName: string;
  city: string;
  visitedAt: Date;
  note: string | null;
  audience: Audience;
  photoIds: string[];
}

/** A photo attached to a crumb. */
export interface CrumbPhoto {
  id: string;
  storagePath: string | null;
}

/** A friend as shown in lists and grids, with derived activity counts. */
export interface FriendSummary {
  id: UserId;
  name: string;
  handle: string;
  avatarPath: string | null;
  /** Total crumbs logged by this friend. */
  places: number;
  /** Crumbs logged in the last 7 days. */
  newPlaces: number;
}

/** How the current actor relates to another user. */
export type FriendshipState =
  | { kind: 'self' }
  | { kind: 'blocked'; blockedBy: 'you' | 'them' | 'both' }
  | { kind: 'accepted' }
  | { kind: 'pending'; direction: 'incoming' | 'outgoing' }
  | { kind: 'none' };

/** One stop on a day's trail. */
export interface DayStop {
  id: string;
  name: string;
  time: string;
  city: string;
  photoCount: number;
  photo: CrumbPhoto | null;
}

/** A day's aggregated log, derived from that day's crumbs. */
export interface DayLog {
  /** YYYY-MM-DD in the user's local timezone. */
  date: string;
  location: string;
  stops: DayStop[];
  photos: CrumbPhoto[];
  note: string | null;
  audience: Audience;
}

/** A week bucket derived from crumbs. */
export interface WeekSummary {
  /** YYYY-MM-DD of the Sunday that starts the week. */
  weekStartDate: string;
  /** YYYY-MM-DD keys with at least one crumb, ascending. */
  dayKeys: string[];
}

export interface SavedPlace {
  id: string;
  userId: UserId;
  name: string;
  category: string;
  price: string;
  photoPath: string | null;
}

export interface Album {
  id: string;
  userId: UserId;
  title: string;
  photoCount: number;
  coverPhotoPath: string | null;
}

/** Photos grouped under a place heading (gallery "Photos" view). */
export interface GallerySection {
  id: string;
  place: string;
  photos: CrumbPhoto[];
}

/** A friend's most recent shared crumb, surfaced as a highlight. */
export interface Highlight {
  id: string;
  friendId: UserId;
  tag: string;
  date: string;
  photo: CrumbPhoto | null;
}

export interface Preferences {
  notifications: boolean;
  locationServices: boolean;
  weeklyEmail: boolean;
  darkMode: boolean;
}

export interface LinkedAccount {
  provider: string;
  connected: boolean;
}
