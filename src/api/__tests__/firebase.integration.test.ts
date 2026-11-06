import { describe, expect, it } from '@jest/globals';
import { createApi } from '@/api';

// Opt-in integration tests that hit the real Firebase project. They are skipped
// by default (npm test) and run with: npm run test:integration
// The Firebase SDK is imported lazily so the mock suite never loads it.
const runIntegration = process.env.RUN_FIREBASE_INTEGRATION === '1';
const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration('firebase integration (opt-in)', () => {
  it('reads a seeded user profile', async () => {
    const { firestoreStore } = await import('@/api/firestore-store');
    const api = createApi({ store: firestoreStore });

    const res = await api.users.get({ userId: 'alicia' }, 'alicia');

    expect(res).not.toBeNull();
    expect(res?.profile.id).toBe('alicia');
  });

  it('lists accepted friends for a seeded user', async () => {
    const { firestoreStore } = await import('@/api/firestore-store');
    const api = createApi({ store: firestoreStore });

    const friends = await api.friends.list({ userId: 'alicia' }, 'alicia');

    expect(Array.isArray(friends)).toBe(true);
    expect(friends.every((f) => typeof f.id === 'string')).toBe(true);
  });
});
