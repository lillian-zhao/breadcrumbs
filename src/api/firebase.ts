import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase client config for the Breadcrumbs project.
 *
 * The API key is provided via EXPO_PUBLIC_FIREBASE_API_KEY (set it in a
 * gitignored .env file). The other values are public identifiers and access is
 * enforced by Firestore/Storage Security Rules, not by hiding them. The API
 * layer only reads/writes through this client; server-side (firebase-admin)
 * code lives elsewhere and is not part of the app.
 */
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: 'breadcrumbs-bc286.firebaseapp.com',
  projectId: 'breadcrumbs-bc286',
  storageBucket: 'breadcrumbs-bc286.firebasestorage.app',
  messagingSenderId: '314725980819',
  appId: '1:314725980819:web:7b47783b5907fb1011cb66',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// memoryLocalCache avoids the AsyncStorage native-module requirement in Expo Go.
// Swap to persistentLocalCache (with @react-native-async-storage) for offline
// persistence later.
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });
export const storage = getStorage(app);
export const auth = getAuth(app);

console.log('[Firebase] configured remote targets', {
  projectId: app.options.projectId,
  storageBucket: storage.app.options.storageBucket,
});
