# Breadcrumbs

A mobile app for logging the little stops in your day - food, coffee, walks - and
sharing them with friends. Built with Expo (React Native) + Expo Router, backed
by Firebase (Firestore + Cloud Storage).

## What's where

- src/app        - screens (Expo Router file-based routing)
- src/components - shared UI components
- src/data       - static mock data used by the screens
- src/api        - the Firebase data-access layer (typed, permission-ready, tested)
- src/hooks      - React hooks
- src/theme.ts   - colors, fonts, spacing

## Prerequisites

Expo SDK 58 needs Node.js ^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0.
Check with:

~~~bash
node -v
~~~

## Setup (first time on a new machine)

~~~bash
npm install
npx expo install --fix   # align package versions with SDK 58
cp .env.example .env     # then set EXPO_PUBLIC_FIREBASE_API_KEY in .env
npx expo start
~~~

Then scan the QR code with Expo Go, or press i / a for the iOS / Android
simulator.

No native plugins or config plugins are required: Firebase is the JS SDK only,
which runs in Expo Go without a development build. The Firebase web API key is
read from EXPO_PUBLIC_FIREBASE_API_KEY (set it in the gitignored .env file); the
other config values in src/api/firebase.ts are public identifiers. Access is
enforced by Firestore / Storage Security Rules, not by hiding the values.

A note on warnings: npm may print an "install-scripts ... not covered by
allowScripts" warning for @firebase/util and protobufjs. Both postinstall scripts
are optional for this app (the Firebase config is loaded from env rather than baked
at install time), so the warning is safe to ignore.

## Data-access API

The data layer lives in src/api. It exposes typed functions that read and write
Firestore, with an injectable permission policy. See src/api/README.md for the
full Firestore schema and permission rules.

Available namespaces and functions (from createApi({ store })):

- users        - get, update
- friends      - list, status, request, accept, unfriend, block, unblock,
                 incoming, outgoing, highlights
- crumbs       - day, daysForMonth, recentPhotos, weeks
- places       - saved, save, remove
- gallery      - sections, albums
- preferences  - get, update
- accounts     - list

Every call takes an Actor (who is asking) so access control is enforced in one
place. There is no sign-in yet, so pass '{ userId }' explicitly; when Firebase
Auth is added, build the Actor from the signed-in user and nothing else changes.

~~~ts
import { createApi } from '@/api';
import { firestoreStore } from '@/api/firestore-store';

const api = createApi({ store: firestoreStore });
const profile = await api.users.get({ userId: 'alicia' }, 'alicia');
~~~

## Tests

Unit tests run against an in-memory store (no Firebase, no network):

~~~bash
npm test
~~~

Opt-in integration tests hit the real Firebase project and are skipped by
default:

~~~bash
npm run test:integration
~~~

Static checks:

~~~bash
npx tsc --noEmit   # typecheck
npx expo lint      # lint
~~~
