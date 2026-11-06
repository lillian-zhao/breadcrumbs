import { api, currentActor } from '@/api/client';
import type { FriendshipState, Preferences } from '@/api';
import { useAsync } from '@/hooks/useAsync';

import { resolvePhoto, resolvePhotos } from './photos';
import type {
  Album,
  DayLog,
  Friend,
  FriendActivity,
  GallerySection,
  Highlight,
  LinkedAccount,
  Photo,
  SavedPlace,
  User,
} from './types';

// API-backed reads for the screens. Each hook resolves Cloud Storage paths into
// renderable Photos so components keep working with the UI types in ./types.

const me = currentActor;

/** YYYY-MM-DD in the device's timezone, matching how the API groups crumbs into days. */
export function dateKey(date: Date) {
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

async function loadUser(userId: string): Promise<User | null> {
  const result = await api.users.get(me, userId);
  if (!result) return null;
  const { profile, stats } = result;
  return {
    id: profile.id,
    name: profile.name,
    handle: profile.handle,
    bio: profile.bio,
    avatar: await resolvePhoto(profile.avatarPath),
    daysLogged: stats.daysLogged,
    // Friendships are symmetric, so every friend both follows and is followed.
    followers: stats.friendCount,
    following: stats.friendCount,
  };
}

export function useCurrentUser() {
  return useAsync(() => loadUser(me.userId), []);
}

export function useFriendProfile(friendId: string) {
  return useAsync(async (): Promise<{ friend: Friend | null; status: FriendshipState }> => {
    const [friend, status] = await Promise.all([loadUser(friendId), api.friends.status(me, friendId)]);
    return { friend, status };
  }, [friendId]);
}

async function loadFriends(): Promise<FriendActivity[]> {
  const friends = await api.friends.list(me, me.userId);
  return Promise.all(
    friends.map(async (friend) => ({
      id: friend.id,
      name: friend.name,
      handle: friend.handle,
      avatar: await resolvePhoto(friend.avatarPath),
      places: friend.places,
      newPlaces: friend.newPlaces,
    })),
  );
}

export function useFriends() {
  return useAsync(loadFriends, []);
}

export function useHighlights() {
  return useAsync(async (): Promise<Highlight[]> => {
    const [highlights, friends] = await Promise.all([api.friends.highlights(me, me.userId), api.friends.list(me, me.userId)]);
    return Promise.all(
      highlights.map(async (highlight) => ({
        id: highlight.id,
        friendId: highlight.friendId,
        friendName: friends.find((friend) => friend.id === highlight.friendId)?.name ?? highlight.friendId,
        tag: highlight.tag,
        date: highlight.date,
        photo: await resolvePhoto(highlight.photo?.storagePath),
      })),
    );
  }, []);
}

export function useRecentPhotos(limit = 4) {
  return useAsync(async (): Promise<Photo[]> => {
    const photos = await api.crumbs.recentPhotos(me, me.userId, limit);
    return resolvePhotos(photos.map((photo) => photo.storagePath));
  }, [limit]);
}

export function useLoggedDays(year: number, month: number) {
  return useAsync(() => api.crumbs.daysForMonth(me, me.userId, year, month), [year, month]);
}

export function useDayLog(date: Date) {
  const key = dateKey(date);
  return useAsync(async (): Promise<DayLog | null> => {
    const day = await api.crumbs.day(me, me.userId, key);
    if (!day) return null;
    return {
      date,
      location: day.location,
      stops: await Promise.all(
        day.stops.map(async (stop) => ({
          id: stop.id,
          name: stop.name,
          time: stop.time.toLowerCase(),
          city: stop.city,
          photoCount: stop.photoCount,
          photo: stop.photo ? await resolvePhoto(stop.photo.storagePath) : undefined,
        })),
      ),
      photos: await resolvePhotos(day.photos.map((photo) => photo.storagePath)),
      note: day.note ?? '',
      audience: day.audience,
    };
  }, [key]);
}

export function useSavedPlaces() {
  return useAsync(async (): Promise<SavedPlace[]> => {
    const places = await api.places.saved(me, me.userId);
    return Promise.all(
      places.map(async (place) => ({
        id: place.id,
        name: place.name,
        category: place.category,
        price: place.price,
        photo: await resolvePhoto(place.photoPath),
      })),
    );
  }, []);
}

export function useAlbums() {
  return useAsync(async (): Promise<Album[]> => {
    const albums = await api.gallery.albums(me, me.userId);
    return Promise.all(
      albums.map(async (album) => ({
        id: album.id,
        title: album.title,
        photoCount: album.photoCount,
        cover: await resolvePhoto(album.coverPhotoPath),
      })),
    );
  }, []);
}

export function useGallerySections() {
  return useAsync(async (): Promise<GallerySection[]> => {
    const sections = await api.gallery.sections(me, me.userId);
    return Promise.all(
      sections.map(async (section) => ({
        id: section.id,
        place: section.place,
        photos: await resolvePhotos(section.photos.map((photo) => photo.storagePath)),
      })),
    );
  }, []);
}

const defaultPreferences: Preferences = {
  notifications: true,
  locationServices: true,
  weeklyEmail: false,
  darkMode: false,
};

export function usePreferences() {
  return useAsync(async () => (await api.preferences.get(me, me.userId)) ?? defaultPreferences, []);
}

const providers: { id: string; name: string; connectedSubtitle: string; disconnectedSubtitle: string }[] = [
  { id: 'google', name: 'Google', connectedSubtitle: 'Connected · Used for sign in', disconnectedSubtitle: 'Not connected' },
  { id: 'apple', name: 'Apple', connectedSubtitle: 'Connected · Used for sign in', disconnectedSubtitle: 'Not connected' },
  {
    id: 'instagram',
    name: 'Instagram',
    connectedSubtitle: 'Connected · No posts shared',
    disconnectedSubtitle: 'Not connected · No posts shared',
  },
];

export function useLinkedAccounts() {
  return useAsync(async (): Promise<LinkedAccount[]> => {
    const accounts = await api.accounts.list(me, me.userId);
    return providers.map((provider) => {
      const connected = accounts.some((account) => account.provider === provider.id && account.connected);
      return {
        id: provider.id,
        name: provider.name,
        subtitle: connected ? provider.connectedSubtitle : provider.disconnectedSubtitle,
        connected,
      };
    });
  }, []);
}

// ---- writes ------------------------------------------------------------

export function updateProfile(patch: { name?: string; handle?: string; bio?: string }) {
  return api.users.update(me, patch);
}

export function updatePreferences(patch: Partial<Preferences>) {
  return api.preferences.update(me, patch);
}

export function removeSavedPlace(placeId: string) {
  return api.places.remove(me, placeId);
}

export function requestFriend(friendId: string) {
  return api.friends.request(me, friendId);
}

export function acceptFriend(requesterId: string) {
  return api.friends.accept(me, requesterId);
}

export function unfriend(friendId: string) {
  return api.friends.unfriend(me, friendId);
}
