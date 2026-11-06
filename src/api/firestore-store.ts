import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  type QueryConstraint,
  type Timestamp,
} from 'firebase/firestore';

import { db } from './firebase';
import {
  friendshipKey,
  type CrumbData,
  type DataStore,
  type FriendshipData,
} from './store';

function toDate(ts: Timestamp | null | undefined): Date {
  return ts ? ts.toDate() : new Date(0);
}

function friendshipDoc(d: Record<string, unknown>): FriendshipData {
  return {
    userId: d.userId as string,
    friendId: d.friendId as string,
    status: d.status as 'pending' | 'accepted',
    requestedBy: d.requestedBy as string,
    createdAt: toDate(d.createdAt as Timestamp),
    updatedAt: toDate(d.updatedAt as Timestamp),
  };
}

function crumbDoc(id: string, d: Record<string, unknown>): CrumbData & { id: string } {
  return {
    id,
    userId: d.userId as string,
    placeName: d.placeName as string,
    city: d.city as string,
    visitedAt: toDate(d.visitedAt as Timestamp),
    note: (d.note as string | null | undefined) ?? null,
    audience: (d.audience as CrumbData['audience'] | undefined) ?? 'private',
    photoIds: (d.photoIds as string[] | undefined) ?? [],
  };
}

/**
 * Firestore implementation of DataStore. This is the only module in the API
 * layer that imports the Firebase SDK; unit tests swap in MemoryStore instead.
 */
export const firestoreStore: DataStore = {
  // ---- users -----------------------------------------------------------

  async getUser(userId) {
    const snap = await getDoc(doc(db, 'users', userId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      id: snap.id,
      name: (d.name as string) ?? '',
      handle: (d.handle as string) ?? '',
      bio: (d.bio as string) ?? '',
      avatarPath: (d.avatarPath as string | null | undefined) ?? null,
      email: (d.email as string | null | undefined) ?? null,
    };
  },

  async setUser(userId, data) {
    await setDoc(doc(db, 'users', userId), data);
  },

  async updateUser(userId, patch) {
    await updateDoc(doc(db, 'users', userId), patch);
  },

  // ---- friendships -----------------------------------------------------

  async listFriendships(userId) {
    const snap = await getDocs(
      query(collection(db, 'friendships'), where('userId', '==', userId)),
    );
    return snap.docs.map((s) => friendshipDoc(s.data()));
  },

  async listFriendshipsTo(friendId) {
    const snap = await getDocs(
      query(collection(db, 'friendships'), where('friendId', '==', friendId)),
    );
    return snap.docs.map((s) => friendshipDoc(s.data()));
  },

  async getFriendship(a, b) {
    const snap = await getDoc(doc(db, 'friendships', friendshipKey(a, b)));
    return snap.exists() ? friendshipDoc(snap.data()) : null;
  },

  async setFriendship(a, b, data) {
    await setDoc(doc(db, 'friendships', friendshipKey(a, b)), data);
  },

  async deleteFriendship(a, b) {
    await deleteDoc(doc(db, 'friendships', friendshipKey(a, b)));
  },

  // ---- blocks ----------------------------------------------------------

  async getBlock(blockerId, blockedId) {
    const snap = await getDoc(doc(db, 'blocks', friendshipKey(blockerId, blockedId)));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      blockerId: d.blockerId as string,
      blockedId: d.blockedId as string,
      createdAt: toDate(d.createdAt as Timestamp),
    };
  },

  async setBlock(blockerId, blockedId, data) {
    await setDoc(doc(db, 'blocks', friendshipKey(blockerId, blockedId)), data);
  },

  async deleteBlock(blockerId, blockedId) {
    await deleteDoc(doc(db, 'blocks', friendshipKey(blockerId, blockedId)));
  },

  // ---- crumbs ----------------------------------------------------------

  async listCrumbs(userId, opts) {
    const constraints: QueryConstraint[] = [where('userId', '==', userId)];
    if (opts?.from) constraints.push(where('visitedAt', '>=', opts.from));
    if (opts?.to) constraints.push(where('visitedAt', '<=', opts.to));
    const snap = await getDocs(query(collection(db, 'crumbs'), ...constraints));
    return snap.docs.map((s) => crumbDoc(s.id, s.data()));
  },

  async getCrumb(crumbId) {
    const snap = await getDoc(doc(db, 'crumbs', crumbId));
    return snap.exists() ? crumbDoc(snap.id, snap.data()) : null;
  },

  // ---- photos ----------------------------------------------------------

  async getPhoto(photoId) {
    const snap = await getDoc(doc(db, 'photos', photoId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return { storagePath: (d.storagePath as string | null | undefined) ?? null };
  },

  // ---- saved places ----------------------------------------------------

  async listSavedPlaces(userId) {
    const snap = await getDocs(
      query(collection(db, 'savedPlaces'), where('userId', '==', userId)),
    );
    return snap.docs.map((s) => {
      const d = s.data();
      return {
        id: s.id,
        userId: d.userId as string,
        name: d.name as string,
        category: d.category as string,
        price: d.price as string,
        photoPath: (d.photoPath as string | null | undefined) ?? null,
        createdAt: toDate(d.createdAt as Timestamp),
      };
    });
  },

  async setSavedPlace(id, data) {
    await setDoc(doc(db, 'savedPlaces', id), data);
  },

  async deleteSavedPlace(id) {
    await deleteDoc(doc(db, 'savedPlaces', id));
  },

  // ---- albums ----------------------------------------------------------

  async listAlbums(userId) {
    const snap = await getDocs(query(collection(db, 'albums'), where('userId', '==', userId)));
    return snap.docs.map((s) => {
      const d = s.data();
      return {
        id: s.id,
        userId: d.userId as string,
        title: d.title as string,
        coverPhotoPath: (d.coverPhotoPath as string | null | undefined) ?? null,
        photoIds: (d.photoIds as string[] | undefined) ?? [],
        createdAt: toDate(d.createdAt as Timestamp),
      };
    });
  },

  // ---- preferences -----------------------------------------------------

  async getPreferences(userId) {
    const snap = await getDoc(doc(db, 'preferences', userId));
    if (!snap.exists()) return null;
    const d = snap.data();
    return {
      notifications: (d.notifications as boolean | undefined) ?? true,
      locationServices: (d.locationServices as boolean | undefined) ?? true,
      weeklyEmail: (d.weeklyEmail as boolean | undefined) ?? false,
      darkMode: (d.darkMode as boolean | undefined) ?? false,
    };
  },

  async setPreferences(userId, data) {
    await setDoc(doc(db, 'preferences', userId), data);
  },

  // ---- linked accounts -------------------------------------------------

  async listLinkedAccounts(userId) {
    const snap = await getDocs(
      query(collection(db, 'linkedAccounts'), where('userId', '==', userId)),
    );
    return snap.docs.map((s) => {
      const d = s.data();
      return {
        provider: d.provider as string,
        connected: (d.connected as boolean | undefined) ?? false,
      };
    });
  },

  async setLinkedAccount(userId, provider, data) {
    await setDoc(doc(db, 'linkedAccounts', userId + '_' + provider), {
      userId,
      provider,
      connected: data.connected,
    });
  },
};
