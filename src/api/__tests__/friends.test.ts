import { describe, expect, it } from '@jest/globals';
import { createApi, PermissionDeniedError } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };
const lillian = { userId: 'lillian' };

function baseStore(): MemoryStore {
  return new MemoryStore().user('alicia', { name: 'Alicia' }).user('lillian', { name: 'Lillian' }).user('mary', { name: 'Mary' });
}

describe('friends.list', () => {
  it('lists accepted friends only, with derived counts', async () => {
    const s = baseStore()
      .friendship('alicia', 'lillian', 'accepted')
      .friendship('lillian', 'alicia', 'accepted')
      .friendship('alicia', 'mary', 'pending')
      .crumb('c1', { userId: 'lillian', visitedAt: new Date() })
      .crumb('c2', { userId: 'lillian', visitedAt: new Date(Date.now() - 10 * 7 * 24 * 3600 * 1000) });
    const api = createApi({ store: s });

    const list = await api.friends.list(alicia, 'alicia');

    expect(list.map((f) => f.id)).toEqual(['lillian']);
    expect(list[0].places).toBe(2);
    expect(list[0].newPlaces).toBe(1);
  });

  it('denies a stranger from reading a friend list', async () => {
    const api = createApi({ store: baseStore() });
    await expect(api.friends.list(alicia, 'lillian')).rejects.toThrow(PermissionDeniedError);
  });
});

describe('friends.status', () => {
  it('reports self, none, accepted, pending, and blocked states', async () => {
    const s = baseStore().friendship('alicia', 'lillian', 'accepted').friendship('lillian', 'alicia', 'accepted');
    const api = createApi({ store: s });

    expect(await api.friends.status(alicia, 'alicia')).toEqual({ kind: 'self' });
    expect(await api.friends.status(alicia, 'mary')).toEqual({ kind: 'none' });
    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'accepted' });
  });

  it('reports outgoing and incoming pending directions', async () => {
    const s = baseStore();
    s.friendship('alicia', 'lillian', 'pending', 'alicia');
    const api = createApi({ store: s });

    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'pending', direction: 'outgoing' });
    expect(await api.friends.status(lillian, 'alicia')).toEqual({ kind: 'pending', direction: 'incoming' });
  });

  it('reports blocked you/them', async () => {
    const s = baseStore().block('alicia', 'lillian');
    const api = createApi({ store: s });

    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'blocked', blockedBy: 'you' });
    expect(await api.friends.status(lillian, 'alicia')).toEqual({ kind: 'blocked', blockedBy: 'them' });
  });
});

describe('friends request lifecycle', () => {
  it('request, accept, then unfriend', async () => {
    const s = baseStore();
    const api = createApi({ store: s });

    await api.friends.request(alicia, 'lillian');
    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'pending', direction: 'outgoing' });

    await api.friends.accept(lillian, 'alicia');
    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'accepted' });
    expect(await api.friends.status(lillian, 'alicia')).toEqual({ kind: 'accepted' });

    await api.friends.unfriend(alicia, 'lillian');
    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'none' });
  });

  it('rejects accepting without a pending request', async () => {
    const api = createApi({ store: baseStore() });
    await expect(api.friends.accept(lillian, 'alicia')).rejects.toThrow('No pending request');
  });

  it('block removes friendship and unblock restores none', async () => {
    const s = baseStore().friendship('alicia', 'lillian', 'accepted').friendship('lillian', 'alicia', 'accepted');
    const api = createApi({ store: s });

    await api.friends.block(alicia, 'lillian');
    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'blocked', blockedBy: 'you' });

    await api.friends.unblock(alicia, 'lillian');
    expect(await api.friends.status(alicia, 'lillian')).toEqual({ kind: 'none' });
  });
});

describe('friends.incoming / outgoing', () => {
  it('exposes pending request directions with profiles', async () => {
    const s = baseStore();
    const api = createApi({ store: s });
    await api.friends.request(alicia, 'lillian');

    const incoming = await api.friends.incoming('lillian');
    const outgoing = await api.friends.outgoing('alicia');

    expect(incoming.map((r) => r.userId)).toEqual(['alicia']);
    expect(incoming[0].name).toBe('Alicia');
    expect(outgoing.map((r) => r.userId)).toEqual(['lillian']);
  });
});

describe('friends.highlights', () => {
  it('returns the most recent shared crumb per friend', async () => {
    const s = baseStore()
      .friendship('alicia', 'lillian', 'accepted')
      .friendship('lillian', 'alicia', 'accepted')
      .crumb('old', { userId: 'lillian', placeName: 'Old', audience: 'friends', visitedAt: new Date(2024, 0, 1, 10), photoIds: ['p1'] })
      .crumb('new', { userId: 'lillian', placeName: 'New', audience: 'friends', visitedAt: new Date(2024, 0, 2, 10), photoIds: [] })
      .photo('p1', 'photos/lillian/p1.jpg');
    const api = createApi({ store: s });

    const highlights = await api.friends.highlights(alicia, 'alicia');

    expect(highlights).toHaveLength(1);
    expect(highlights[0].friendId).toBe('lillian');
    expect(highlights[0].tag).toBe('New');
    expect(highlights[0].photo).toBeNull();
  });
});
