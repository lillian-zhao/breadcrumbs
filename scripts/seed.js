#!/usr/bin/env node
/**
 * Seed demo data into Breadcrumbs Firestore, or list existing users.
 * Requires firebase-admin (dev dependency) and a service-account key.
 *
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node scripts/seed.js
 *   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node scripts/seed.js --list
 */

const { initializeApp, cert } = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const path = require('path');

const listOnly = process.argv.includes('--list');
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!credentialsPath) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json');
  process.exit(1);
}

const serviceAccount = require(path.resolve(credentialsPath));

initializeApp({
  credential: cert(serviceAccount),
  projectId: 'breadcrumbs-bc286',
});

const db = getFirestore();
const auth = getAuth();

async function listUsers() {
  const snap = await db.collection('users').get();
  console.log('Firestore users (' + snap.size + '):');
  snap.forEach((doc) => {
    const d = doc.data();
    console.log('  ' + doc.id + '  ' + (d.name ?? '?') + '  ' + (d.handle ?? '') + '  ' + (d.email ?? ''));
  });
  try {
    const authUsers = await auth.listUsers(1000);
    console.log('Firebase Auth accounts (' + authUsers.users.length + '):');
    authUsers.users.forEach((u) => {
      console.log('  ' + u.uid + '  ' + (u.displayName ?? '') + '  ' + (u.email ?? ''));
    });
  } catch (err) {
    console.log('(could not list Auth accounts: ' + err.message + ')');
  }
}

async function seed() {
  const now = new Date();
  const batch = db.batch();

  const users = {
    lillian: { name: 'Lillian', handle: '@lillian', bio: 'Little stops, good food.', avatarPath: null, email: null },
    annie: { name: 'Annie', handle: '@annie', bio: 'Little stops, good company.', avatarPath: null, email: null },
    alicia: { name: 'Alicia', handle: '@alicia', bio: 'Coffee, clay, and a slow Saturday.', avatarPath: null, email: null },
    tongtong: { name: 'Tongtong', handle: '@tongtong', bio: 'Late lights and leftover songs.', avatarPath: null, email: null },
    maggie: { name: 'Maggie', handle: '@maggie', bio: 'Kitchens, colors, and a shelf.', avatarPath: null, email: null },
  };

  for (const [id, data] of Object.entries(users)) {
    batch.set(db.collection('users').doc(id), data);
    batch.set(db.collection('preferences').doc(id), {
      notifications: true,
      locationServices: true,
      weeklyEmail: false,
      darkMode: false,
    });
  }

  const pairs = [
    ['lillian', 'annie'],
    ['lillian', 'alicia'],
    ['lillian', 'maggie'],
    ['annie', 'alicia'],
    ['annie', 'maggie'],
  ];
  for (const [a, b] of pairs) {
    const fwd = { userId: a, friendId: b, status: 'accepted', requestedBy: a, createdAt: now, updatedAt: now };
    const rev = { userId: b, friendId: a, status: 'accepted', requestedBy: a, createdAt: now, updatedAt: now };
    batch.set(db.collection('friendships').doc(a + '_' + b), fwd);
    batch.set(db.collection('friendships').doc(b + '_' + a), rev);
  }

  const crumbs = [
    { id: 'annie-cafe', userId: 'annie', placeName: 'Cafe', city: 'Pittsburgh', visitedAt: new Date('2026-11-06T10:30:00'), note: 'A little pick-me-up.', audience: 'friends', photoIds: [] },
    { id: 'alicia-park', userId: 'alicia', placeName: 'Park Cafe', city: 'Pittsburgh', visitedAt: new Date('2026-11-06T09:15:00'), note: 'Morning walk then coffee.', audience: 'friends', photoIds: [] },
    { id: 'maggie-rooftop', userId: 'maggie', placeName: 'Rooftop Bar', city: 'Pittsburgh', visitedAt: new Date('2026-11-05T19:05:00'), note: 'Lights over the river.', audience: 'friends', photoIds: [] },
    { id: 'lillian-bistro', userId: 'lillian', placeName: 'The Bistro', city: 'Pittsburgh', visitedAt: new Date('2026-11-04T20:00:00'), note: 'Dinner for two.', audience: 'friends', photoIds: [] },
    { id: 'tongtong-tea', userId: 'tongtong', placeName: 'HeyTea', city: 'Cambridge', visitedAt: new Date('2026-11-03T14:00:00'), note: 'Tea with friends.', audience: 'friends', photoIds: [] },
  ];
  for (const c of crumbs) {
    const { id, ...data } = c;
    batch.set(db.collection('crumbs').doc(id), data);
  }

  const places = [
    { id: 'bistro', userId: 'lillian', name: 'The Bistro', category: 'Italian', price: '$$', photoPath: null, createdAt: now },
    { id: 'park-cafe', userId: 'lillian', name: 'Park Cafe', category: 'Coffee', price: '$', photoPath: null, createdAt: now },
    { id: 'rooftop', userId: 'lillian', name: 'Rooftop Bar', category: 'Bar', price: '$$$', photoPath: null, createdAt: now },
  ];
  for (const p of places) {
    const { id, ...data } = p;
    batch.set(db.collection('savedPlaces').doc(id), data);
  }

  await batch.commit();
  console.log('Seeded ' + Object.keys(users).length + ' users, ' + pairs.length * 2 + ' friendship docs, ' + crumbs.length + ' crumbs, ' + places.length + ' saved places.');
  await listUsers();
}

(async () => {
  if (listOnly) await listUsers();
  else await seed();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
