import { createApi, type Actor } from './index';
import { firestoreStore } from './firestore-store';

/**
 * The app-wide API instance, backed by Firestore.
 *
 * Kept out of ./index.ts so unit tests can import createApi without loading
 * the Firebase SDK.
 */
export const api = createApi({ store: firestoreStore });

/**
 * Who the app is acting as. There is no sign-in yet, so this is the seeded
 * user the designs are built around. When Firebase Auth lands, derive this
 * from the signed-in user instead.
 */
export const currentActor: Actor = { userId: 'lillian' };
