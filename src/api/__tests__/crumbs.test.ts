import { describe, expect, it } from '@jest/globals';
import { createApi, PermissionDeniedError } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };
const lillian = { userId: 'lillian' };

function storeWithCrumbs(): MemoryStore {
  return new MemoryStore()
    .user('alicia')
    .user('lillian')
    .friendship('alicia', 'lillian', 'accepted')
    .friendship('lillian', 'alicia', 'accepted');
}

describe('crumbs.day', () => {
  it('derives a day log with stops, note, and audience for self', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .crumb('walk', { userId: 'alicia', placeName: 'Morning walk', city: 'Pittsburgh', visitedAt: new Date(2024, 0, 15, 9, 15), note: 'A slow morning', audience: 'private', photoIds: ['p1'] })
      .crumb('cafe', { userId: 'alicia', placeName: 'Cafe', city: 'Pittsburgh', visitedAt: new Date(2024, 0, 15, 10, 30), note: null, audience: 'friends', photoIds: [] })
      .photo('p1', 'photos/alicia/p1.jpg');
    const api = createApi({ store: s });

    const day = await api.crumbs.day(alicia, 'alicia', '2024-01-15');

    expect(day).not.toBeNull();
    expect(day?.stops.map((st) => st.name)).toEqual(['Morning walk', 'Cafe']);
    expect(day?.note).toBe('A slow morning');
    expect(day?.audience).toBe('friends'); // any stop shared -> day is shared
    expect(day?.photos).toHaveLength(1);
  });

  it('returns null when there are no crumbs on that day', async () => {
    const api = createApi({ store: new MemoryStore().user('alicia') });
    await expect(api.crumbs.day(alicia, 'alicia', '2024-01-15')).resolves.toBeNull();
  });

  it('lets a friend read a friends-audience day', async () => {
    const s = storeWithCrumbs().crumb('c', { userId: 'lillian', placeName: 'Cafe', visitedAt: new Date(2024, 0, 15, 10), audience: 'friends' });
    const api = createApi({ store: s });
    const day = await api.crumbs.day(alicia, 'lillian', '2024-01-15');
    expect(day?.stops[0].name).toBe('Cafe');
  });

  it('denies a friend reading a private day', async () => {
    const s = storeWithCrumbs().crumb('c', { userId: 'lillian', placeName: 'Cafe', visitedAt: new Date(2024, 0, 15, 10), audience: 'private' });
    const api = createApi({ store: s });
    await expect(api.crumbs.day(alicia, 'lillian', '2024-01-15')).rejects.toThrow(PermissionDeniedError);
  });

  it('denies a stranger', async () => {
    const s = new MemoryStore().user('lillian').crumb('c', { userId: 'lillian', placeName: 'Cafe', visitedAt: new Date(2024, 0, 15, 10), audience: 'friends' });
    const api = createApi({ store: s });
    await expect(api.crumbs.day(alicia, 'lillian', '2024-01-15')).rejects.toThrow(PermissionDeniedError);
  });
});

describe('crumbs.daysForMonth', () => {
  it('returns only the day numbers visible to the caller', async () => {
    const s = storeWithCrumbs()
      .crumb('a', { userId: 'lillian', visitedAt: new Date(2024, 0, 15, 10), audience: 'friends' })
      .crumb('b', { userId: 'lillian', visitedAt: new Date(2024, 0, 20, 10), audience: 'private' });
    const api = createApi({ store: s });

    expect(await api.crumbs.daysForMonth(alicia, 'lillian', 2024, 0)).toEqual([15]);
    expect(await api.crumbs.daysForMonth(lillian, 'lillian', 2024, 0)).toEqual([15, 20]);
  });
});

describe('crumbs.recentPhotos', () => {
  it('returns newest photos first and respects the limit', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .crumb('old', { userId: 'alicia', visitedAt: new Date(2024, 0, 1, 10), photoIds: ['p1'] })
      .crumb('new', { userId: 'alicia', visitedAt: new Date(2024, 0, 2, 10), photoIds: ['p2', 'p3'] })
      .photo('p1', 'a.jpg')
      .photo('p2', 'b.jpg')
      .photo('p3', 'c.jpg');
    const api = createApi({ store: s });

    const photos = await api.crumbs.recentPhotos(alicia, 'alicia', 2);

    expect(photos.map((p) => p.id)).toEqual(['p2', 'p3']);
  });
});

describe('crumbs.weeks', () => {
  it('groups crumbs into week buckets by Sunday start', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .crumb('mon', { userId: 'alicia', visitedAt: new Date(2024, 0, 15, 10) }) // Monday
      .crumb('wed', { userId: 'alicia', visitedAt: new Date(2024, 0, 17, 10) }); // Wednesday
    const api = createApi({ store: s });

    const weeks = await api.crumbs.weeks(alicia, 'alicia');

    expect(weeks).toHaveLength(1);
    expect(weeks[0].weekStartDate).toBe('2024-01-14'); // Sunday
    expect(weeks[0].dayKeys).toEqual(['2024-01-15', '2024-01-17']);
  });
});
