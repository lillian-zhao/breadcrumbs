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

The app uses expo-maps (a native module), so it can NOT run in Expo Go. See
"Running with maps (development build)" below for the full machine setup.

A note on warnings: npm may print an "install-scripts ... not covered by
allowScripts" warning for @firebase/util and protobufjs. Both postinstall scripts
are optional for this app (the Firebase config is loaded from env rather than baked
at install time), so the warning is safe to ignore.

## Running with maps (development build)

The app renders maps with expo-maps (Apple Maps on iOS, Google Maps on Android).
Because maps are a native module, the app can NOT run in Expo Go - you need a
native development build plus the right toolchain and API keys.

### 1. Environment variables

Create .env from .env.example and fill in three keys:

~~~bash
EXPO_PUBLIC_FIREBASE_API_KEY=...        # Firebase web API key
EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=...   # Google Places API (New)
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...     # Google Maps SDK for Android (optional on iOS)
~~~

.env is gitignored. The Firebase key comes from Firebase Console -> Project
settings -> Your apps -> Web app. The Google keys come from Google Cloud Console
-> APIs & Services -> Credentials (enable "Places API (New)" and "Maps SDK for
Android").

### 2. iOS (Apple Maps)

Requires Xcode 26.x (Swift 6.2) on macOS Sequoia 15.6 or later.

~~~bash
brew install cocoapods        # only if pod is missing
npx expo run:ios
~~~

expo-maps needs iOS 18.0+.

### 3. Android (Google Maps)

Requires JDK 17+ and the Android SDK (the NDK is auto-installed on first build).

~~~bash
# JDK 17 (Homebrew)
brew install openjdk@17
export JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"

# tell Gradle where the Android SDK lives
echo "sdk.dir=$ANDROID_HOME" > android/local.properties

# start an emulator first, then:
npx expo run:android
~~~

The first build is slow (it compiles every native module); later builds are fast.

### If the map won't draw tiles (blank/gray map)

Google Maps on Android runs through Google Play Services, not your app's APK.
If the map mounts but never draws tiles, logcat shows:

~~~text
W Google Maps Android API: maps_core feature is module is not recognized;
   Google Play Services may need to be updated. Requesting a module install will fail.
~~~

That means the emulator's Google Play Services is out of date. Fix it by:

1. Opening Play Store -> profile avatar -> Settings -> About -> "Update Play
   Store" and letting Google Play Services update (or just leave the emulator
   online a few minutes; GMS self-updates in the background).
2. If that doesn't take, update the emulator image: Android Studio -> SDK
   Manager -> SDK Platforms -> install the latest "Google Play ... System Image",
   then AVD Manager -> Cold Boot Now.
3. `adb shell pm clear com.google.android.gms` forces GMS to re-initialize
   (you'll sign back into Google on the emulator afterward).

Also confirm the Google Cloud key has "Maps SDK for Android" enabled - it is a
separate toggle from "Places API (New)" (search works without it, maps do not).

## Data-access API

The data layer lives in src/api. It exposes typed functions that read and write
Firestore, with an injectable permission policy. See src/api/README.md for the
full Firestore schema and permission rules.

Available namespaces and functions (from createApi({ store })):

- users        - get, update, search
- friends      - list, status, request, accept, unfriend, block, unblock,
                 incoming, outgoing, highlights
- crumbs       - day, daysForMonth, recentPhotos, weeks, create, list
- places       - saved, save, remove
- gallery      - sections, albums
- photos       - add
- preferences  - get, update
- accounts     - list

Every call takes an Actor (who is asking) so access control is enforced in one
place. Sign-in is Firebase Auth (email/password); the app derives the Actor from
the signed-in user automatically.

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
# Firebase Storage rules

Deploy the rules in [`storage.rules`](./storage.rules) to Firebase Console →
Storage → Rules for the `breadcrumbs-bc286` bucket. They allow signed-in users
to read photos used by shared crumbs and profiles, and allow each user to
upload image files only into their own `photos/{uid}/` folder (up to 20 MB).
