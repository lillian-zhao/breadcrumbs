import { describe, expect, it } from '@jest/globals';
import { createApi, PermissionDeniedError } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };

describe('places.saved', () => {
  it('lists saved places for self', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .savedPlace('p1', { userId: 'alicia', name: 'The Bistro', category: 'Italian', price: '$$' });
    const api = createApi({ store: s });

    const places = await api.places.saved(alicia, 'alicia');

    expect(places).toHaveLength(1);
    expect(places[0].name).toBe('The Bistro');
    expect(places[0].category).toBe('Italian');
  });

  it('lets a friend read saved places', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .user('lillian')
      .friendship('alicia', 'lillian', 'accepted')
      .friendship('lillian', 'alicia', 'accepted')
      .savedPlace('p1', { userId: 'lillian', name: 'Park Cafe' });
    const api = createApi({ store: s });

    const places = await api.places.saved(alicia, 'lillian');
    expect(places[0].name).toBe('Park Cafe');
  });

  it('denies a stranger', async () => {
    const s = new MemoryStore().user('lillian').savedPlace('p1', { userId: 'lillian', name: 'X' });
    const api = createApi({ store: s });
    await expect(api.places.saved(alicia, 'lillian')).rejects.toThrow(PermissionDeniedError);
  });
});

describe('places.save / remove', () => {
  it('saves with a provided id and removes it again', async () => {
    const s = new MemoryStore().user('alicia');
    const api = createApi({ store: s });

    const id = await api.places.save(alicia, { name: 'Rooftop', category: 'Bar', price: '$$$', photoPath: null }, 'rooftop');
    expect(id).toBe('rooftop');
    expect(await api.places.saved(alicia, 'alicia')).toHaveLength(1);

    await api.places.remove(alicia, 'rooftop');
    expect(await api.places.saved(alicia, 'alicia')).toHaveLength(0);
  });

  it('does not remove a place it does not own', async () => {
    const s = new MemoryStore().user('alicia').user('lillian').savedPlace('p1', { userId: 'lillian', name: 'X' });
    const api = createApi({ store: s });

    await api.places.remove(alicia, 'p1');
    expect(await api.places.saved({ userId: 'lillian' }, 'lillian')).toHaveLength(1);
  });
});
