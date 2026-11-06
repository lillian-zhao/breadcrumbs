import { describe, expect, it } from '@jest/globals';
import { createApi } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };

describe('gallery.sections', () => {
  it('groups photos under each place', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .crumb('c1', { userId: 'alicia', placeName: 'Cafe', photoIds: ['p1', 'p2'] })
      .crumb('c2', { userId: 'alicia', placeName: 'Cafe', photoIds: ['p3'] })
      .crumb('c3', { userId: 'alicia', placeName: 'Park', photoIds: [] })
      .photo('p1', 'a.jpg')
      .photo('p2', 'b.jpg')
      .photo('p3', 'c.jpg');
    const api = createApi({ store: s });

    const sections = await api.gallery.sections(alicia, 'alicia');

    expect(sections).toHaveLength(1);
    expect(sections[0].place).toBe('Cafe');
    expect(sections[0].photos.map((p) => p.id)).toEqual(['p1', 'p2', 'p3']);
  });
});

describe('gallery.albums', () => {
  it('derives photoCount from the album photo ids', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .album('a1', { userId: 'alicia', title: 'Summer 2024', photoIds: ['p1', 'p2', 'p3'], coverPhotoPath: 'covers/summer.jpg' });
    const api = createApi({ store: s });

    const albums = await api.gallery.albums(alicia, 'alicia');

    expect(albums).toHaveLength(1);
    expect(albums[0].title).toBe('Summer 2024');
    expect(albums[0].photoCount).toBe(3);
    expect(albums[0].coverPhotoPath).toBe('covers/summer.jpg');
  });
});
