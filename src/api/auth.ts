import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { auth, db } from './firebase';

let currentUser: User | null = null;
const subscribers = new Set<() => void>();

// Start the auth listener once at module load. The callback fires with the
// initial state and on every subsequent sign-in/sign-out.
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  for (const notify of subscribers) notify();
});

function subscribe(notify: () => void) {
  subscribers.add(notify);
  return () => {
    subscribers.delete(notify);
  };
}

/** The current Firebase user, or null when signed out. */
export function getCurrentUser(): User | null {
  return currentUser;
}

/** The current signed-in user id, or null when signed out. */
export function getCurrentUserId(): string | null {
  // `onAuthStateChanged` can deliver its first event after a screen starts an
  // upload. Firebase's synchronous currentUser is already available then.
  return currentUser?.uid ?? auth.currentUser?.uid ?? null;
}

/** React hook that re-renders when auth state changes. */
export function useAuthUser(): User | null {
  const [user, setUser] = useState<User | null>(currentUser);
  useEffect(() => subscribe(() => setUser(currentUser)), []);
  return user;
}

export function signIn(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email: string, password: string, name: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  if (credential.user) {
    await updateProfile(credential.user, { displayName: name });
    await ensureUserDoc(credential.user.uid, name, email);
  }
  return credential;
}

export function signOut() {
  return firebaseSignOut(auth);
}

async function ensureUserDoc(uid: string, name: string, email: string) {
  await setDoc(doc(db, 'users', uid), {
    name,
    handle: '@' + uid,
    bio: '',
    avatarPath: null,
    email,
  });
}
