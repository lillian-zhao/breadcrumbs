import { getCurrentUserId, useAuthUser } from '@/api/auth';
import { api } from '@/api/client';
import type { Audience, FriendshipState, Preferences } from '@/api';
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

type Actor = { userId: string };

/** The currently signed-in actor. Falls back to an empty id when signed out. */
function currentActor(): Actor {
  return { userId: getCurrentUserId() ?? '' };
}

/** Subscribe to auth changes and return the current signed-in user id. */
function useCurrentUserId(): string {
  useAuthUser();
  return getCurrentUserId() ?? '';
}

/** YYYY-MM-DD in the device's timezone, matching how the API groups crumbs into days. */
export function dateKey(date: Date) {
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
}

async function loadUser(actor: Actor, userId: string): Promise<User | null> {
  const result = await api.users.get(actor, userId);
  if (!result) return null;
  const { profile, stats } = result;
  return {
    id: profile.id,
    name: profile.name,
    handle: profile.handle,
    bio: profile.bio,
    avatar: await resolvePhoto(profile.avatarPath),
    daysLogged: stats.daysLogged,
    followers: stats.friendCount,
    following: stats.friendCount,
  };
}

export function useCurrentUser() {
  const userId = useCurrentUserId();
  return useAsync(() => loadUser(currentActor(), userId), [userId]);
}

export function useFriendProfile(friendId: string) {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<{ friend: Friend | null; status: FriendshipState }> => {
    const [friend, status] = await Promise.all([
      loadUser(currentActor(), friendId),
      api.friends.status(currentActor(), friendId),
    ]);
    return { friend, status };
  }, [friendId, userId]);
}

export function usePeopleSearch(query: string) {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<Friend[]> => {
    const results = await api.users.search(currentActor(), query);
    return Promise.all(
      results.map(async (user) => ({
        id: user.id,
        name: user.name,
        handle: user.handle,
        bio: user.bio,
        avatar: await resolvePhoto(user.avatarPath),
      })),
    );
  }, [userId, query]);
}

async function loadFriends(actor: Actor): Promise<FriendActivity[]> {
  const friends = await api.friends.list(actor, actor.userId);
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
  const userId = useCurrentUserId();
  return useAsync(() => loadFriends(currentActor()), [userId]);
}

export function useHighlights() {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<Highlight[]> => {
    const actor = currentActor();
    const [highlights, friends] = await Promise.all([
      api.friends.highlights(actor, actor.userId),
      api.friends.list(actor, actor.userId),
    ]);
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
  }, [userId]);
}

export function useRecentPhotos(limit = 4) {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<Photo[]> => {
    const photos = await api.crumbs.recentPhotos(currentActor(), userId, limit);
    return resolvePhotos(photos.map((photo) => photo.storagePath));
  }, [userId, limit]);
}

export function useLoggedDays(year: number, month: number) {
  const userId = useCurrentUserId();
  return useAsync(() => api.crumbs.daysForMonth(currentActor(), userId, year, month), [userId, year, month]);
}

export function useDayLog(date: Date) {
  const key = dateKey(date);
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<DayLog | null> => {
    const day = await api.crumbs.day(currentActor(), userId, key);
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
  }, [key, userId]);
}

export function useSavedPlaces() {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<SavedPlace[]> => {
    const places = await api.places.saved(currentActor(), userId);
    return Promise.all(
      places.map(async (place) => ({
        id: place.id,
        name: place.name,
        category: place.category,
        price: place.price,
        photo: await resolvePhoto(place.photoPath),
      })),
    );
  }, [userId]);
}

export function useAlbums() {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<Album[]> => {
    const albums = await api.gallery.albums(currentActor(), userId);
    return Promise.all(
      albums.map(async (album) => ({
        id: album.id,
        title: album.title,
        photoCount: album.photoCount,
        cover: await resolvePhoto(album.coverPhotoPath),
      })),
    );
  }, [userId]);
}

export function useGallerySections() {
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<GallerySection[]> => {
    const sections = await api.gallery.sections(currentActor(), userId);
    return Promise.all(
      sections.map(async (section) => ({
        id: section.id,
        place: section.place,
        photos: await resolvePhotos(section.photos.map((photo) => photo.storagePath)),
      })),
    );
  }, [userId]);
}

const defaultPreferences: Preferences = {
  notifications: true,
  locationServices: true,
  weeklyEmail: false,
  darkMode: false,
};

export function usePreferences() {
  const userId = useCurrentUserId();
  return useAsync(async () => (await api.preferences.get(currentActor(), userId)) ?? defaultPreferences, [userId]);
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
  const userId = useCurrentUserId();
  return useAsync(async (): Promise<LinkedAccount[]> => {
    const accounts = await api.accounts.list(currentActor(), userId);
    return providers.map((provider) => {
      const connected = accounts.some((account) => account.provider === provider.id && account.connected);
      return {
        id: provider.id,
        name: provider.name,
        subtitle: connected ? provider.connectedSubtitle : provider.disconnectedSubtitle,
        connected,
      };
    });
  }, [userId]);
}

// ---- writes ----

export function updateProfile(patch: { name?: string; handle?: string; bio?: string }) {
  return api.users.update(currentActor(), patch);
}

export function updatePreferences(patch: Partial<Preferences>) {
  return api.preferences.update(currentActor(), patch);
}

export function removeSavedPlace(placeId: string) {
  return api.places.remove(currentActor(), placeId);
}

export function requestFriend(friendId: string) {
  return api.friends.request(currentActor(), friendId);
}

export function acceptFriend(requesterId: string) {
  return api.friends.accept(currentActor(), requesterId);
}

export function unfriend(friendId: string) {
  return api.friends.unfriend(currentActor(), friendId);
}

export function createCrumb(input: {
  placeName: string;
  city: string;
  visitedAt: Date;
  note: string | null;
  audience: Audience;
  photoIds?: string[];
}) {
  return api.crumbs.create(currentActor(), input);
}
