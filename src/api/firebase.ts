import { getApps, initializeApp } from 'firebase/app';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase client config for the Breadcrumbs project.
 *
 * These values are NOT secrets - they ship with the client bundle and access
 * is enforced by Firestore/Storage Security Rules, not by hiding them.
 * The API layer only reads/writes through this client; server-side
 * (firebase-admin) code lives elsewhere and is not part of the app.
 */
const firebaseConfig = {
  apiKey: 'REDACTED_API_KEY',
  authDomain: 'breadcrumbs-bc286.firebaseapp.com',
  projectId: 'breadcrumbs-bc286',
  storageBucket: 'breadcrumbs-bc286.firebasestorage.app',
  messagingSenderId: '314725980819',
  appId: '1:314725980819:web:a69ebea64d66fcaf11cb66',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// memoryLocalCache avoids the AsyncStorage native-module requirement in Expo Go.
// Swap to persistentLocalCache (with @react-native-async-storage) for offline
// persistence later.
export const db = initializeFirestore(app, { localCache: memoryLocalCache() });
export const storage = getStorage(app);
