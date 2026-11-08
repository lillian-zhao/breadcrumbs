import { describe, expect, it } from '@jest/globals';
import { createApi, PermissionDeniedError } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };

function baseStore(): MemoryStore {
  return new MemoryStore()
    .user('alicia', { name: 'Alicia', handle: '@alicia', bio: 'Coffee and clay' })
    .user('lillian', { name: 'Lillian', handle: '@lillian', bio: 'Little stops' });
}

describe('users.get', () => {
  it('returns profile and derived stats for self', async () => {
    const s = baseStore();
    s.crumb('c1', { userId: 'alicia', visitedAt: new Date(2024, 0, 1, 10) });
    s.crumb('c2', { userId: 'alicia', visitedAt: new Date(2024, 0, 1, 15) });
    s.crumb('c3', { userId: 'alicia', visitedAt: new Date(2024, 0, 2, 10) });
    const api = createApi({ store: s });

    const res = await api.users.get(alicia, 'alicia');

    expect(res).not.toBeNull();
    expect(res?.profile.name).toBe('Alicia');
    expect(res?.stats.daysLogged).toBe(2);
    expect(res?.stats.friendCount).toBe(0);
  });

  it('returns null for a missing user', async () => {
    const api = createApi({ store: baseStore() });
    await expect(api.users.get(alicia, 'ghost')).resolves.toBeNull();
  });

  it('lets a friend read the profile', async () => {
    const s = baseStore().friendship('alicia', 'lillian', 'accepted').friendship('lillian', 'alicia', 'accepted');
    const api = createApi({ store: s });
    const res = await api.users.get(alicia, 'lillian');
    expect(res?.profile.handle).toBe('@lillian');
  });

  it('lets a stranger read the public profile', async () => {
    const api = createApi({ store: baseStore() });
    const res = await api.users.get(alicia, 'lillian');
    expect(res?.profile.name).toBe('Lillian');
  });

  it('denies a blocked user', async () => {
    const s = baseStore().block('lillian', 'alicia');
    const api = createApi({ store: s });
    await expect(api.users.get(alicia, 'lillian')).rejects.toThrow(PermissionDeniedError);
  });
});

describe('users.update', () => {
  it('updates the caller profile', async () => {
    const s = baseStore();
    const api = createApi({ store: s });
    await api.users.update(alicia, { name: 'Alicia C.' });
    const u = await s.getUser('alicia');
    expect(u?.name).toBe('Alicia C.');
  });
});

describe('users.search', () => {
  it('finds users by name/handle/bio and excludes the actor', async () => {
    const s = baseStore().user('priya', { name: 'Priya', handle: '@priya', bio: 'Clay dust' });
    const api = createApi({ store: s });
    const results = await api.users.search(alicia, 'priya');
    expect(results.map((u) => u.id)).toEqual(['priya']);
  });

  it('returns all other users for an empty query', async () => {
    const api = createApi({ store: baseStore() });
    const results = await api.users.search(alicia, '');
    expect(results.map((u) => u.id)).toEqual(['lillian']);
  });

  it('does not expose email addresses', async () => {
    const s = baseStore().user('priya', { name: 'Priya', email: 'secret@example.com' });
    const api = createApi({ store: s });
    const results = await api.users.search(alicia, 'priya');
    expect(results[0]).not.toHaveProperty('email');
  });
});
