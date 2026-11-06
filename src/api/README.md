# Breadcrumbs data-access API

This directory is the app's data layer. It turns Firestore reads/writes into
plain, typed functions and enforces access control in one place so the UI never
talks to Firebase directly.

Screens reach it through the hooks in src/data/hooks.ts, which call the shared
instance in client.ts and resolve Storage paths into image sources. Today there
is no sign-in: client.ts acts as the seeded user 'lillian'. The layer is designed
so auth and permissions can be added without rewriting it.

## Layout

- types.ts          - domain types returned by the API (storage paths, not image sources)
- permissions.ts    - Actor, Permission, PermissionPolicy, and PermissionDeniedError
- store.ts          - DataStore interface + Firestore document shapes
- firebase.ts       - Firebase client init (app, Firestore, Storage)
- firestore-store.ts - Firestore implementation of DataStore (the only module that imports the SDK)
- index.ts          - createApi(options) factory that builds the public API
- client.ts         - the app's Firestore-backed api instance and currentActor
- testing/memory-store.ts - in-memory DataStore used by unit tests

## Firestore schema

Days and weeks are NOT stored; they are derived at read time from crumbs grouped
by the local date of visitedAt.

~~~text
users/{userId}                   name, handle, bio, avatarPath, email?
friendships/{userId}_{friendId}  userId, friendId, status (pending|accepted), requestedBy, createdAt, updatedAt
blocks/{blockerId}_{blockedId}   blockerId, blockedId, createdAt
crumbs/{crumbId}                 userId, placeName, city, visitedAt, note, audience (private|friends), photoIds
photos/{photoId}                 storagePath
savedPlaces/{savedPlaceId}       userId, name, category, price, photoPath, createdAt
albums/{albumId}                 userId, title, coverPhotoPath, photoIds, createdAt
preferences/{userId}             notifications, locationServices, weeklyEmail, darkMode
linkedAccounts/{userId}_{provider} userId, provider, connected, createdAt
~~~

Friendships are directed docs; an accepted friendship is written to BOTH
directions so the pair is symmetric. Underscores are reserved in usernames
because the doc id is userId + '_' + friendId.

A crumb is one logged place visit (a "little stop"). A "day" (src/data DayLog) is
derived by grouping a user's crumbs by local date: its note is the first crumb
note, and its audience is "friends" when any stop is shared.

## Permissions

Every API call takes an Actor (who is asking) and checks it against a
PermissionPolicy. The default policy:

- self: allowed everything
- blocked: denied everything
- friend: read profile, friends, saved places, albums; read crumbs only when the
  owner chose the "friends" audience
- stranger: read public profile only
- writes: self only

An Actor is just '{ userId }' today. To add sign-in later, build the Actor from
Firebase Auth's current user and pass it in - the API and policy do not change.
Swap 'defaultPolicy' for a richer one (roles, per-user privacy settings, etc.) by
passing 'policy' to createApi.

## Usage

~~~ts
import { createApi } from '@/api';
import { firestoreStore } from '@/api/firestore-store';

const api = createApi({ store: firestoreStore });

const alicia = { userId: 'alicia' };

const profile = await api.users.get(alicia, 'alicia');
const friends = await api.friends.list(alicia, 'alicia');
const today = await api.crumbs.day(alicia, 'alicia', '2024-10-05');
const state = await api.friends.status(alicia, 'lillian');
~~~

Each namespace is read-focused with a small set of writes:

- users.get / users.update
- friends.list / status / request / accept / unfriend / block / unblock / incoming / outgoing / highlights
- crumbs.day / daysForMonth / recentPhotos / weeks
- places.saved / save / remove
- gallery.sections / albums
- preferences.get / update
- accounts.list

## Testing

Unit tests run against MemoryStore (no Firebase, no network):

~~~bash
npm test
~~~

Opt-in integration tests hit the real Firebase project (seeded data) and are
skipped by default:

~~~bash
npm run test:integration
~~~

The Firestore implementation intentionally does not batch multi-document
friendship writes atomically yet; a transaction/batch method is a known follow-up
once writes are wired to the UI.
