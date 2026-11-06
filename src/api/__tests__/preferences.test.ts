import { describe, expect, it } from '@jest/globals';
import { createApi, PermissionDeniedError } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };

describe('preferences.get', () => {
  it('returns null when unset', async () => {
    const api = createApi({ store: new MemoryStore().user('alicia') });
    await expect(api.preferences.get(alicia, 'alicia')).resolves.toBeNull();
  });

  it('returns stored preferences for self', async () => {
    const s = new MemoryStore().user('alicia').prefs('alicia', { darkMode: true });
    const api = createApi({ store: s });
    const p = await api.preferences.get(alicia, 'alicia');
    expect(p?.darkMode).toBe(true);
  });

  it('denies a friend reading preferences', async () => {
    const s = new MemoryStore()
      .user('alicia')
      .user('lillian')
      .friendship('alicia', 'lillian', 'accepted')
      .friendship('lillian', 'alicia', 'accepted')
      .prefs('lillian');
    const api = createApi({ store: s });
    await expect(api.preferences.get(alicia, 'lillian')).rejects.toThrow(PermissionDeniedError);
  });
});

describe('preferences.update', () => {
  it('merges over defaults and persists', async () => {
    const s = new MemoryStore().user('alicia');
    const api = createApi({ store: s });

    await api.preferences.update(alicia, { darkMode: true });

    const p = await api.preferences.get(alicia, 'alicia');
    expect(p?.darkMode).toBe(true);
    expect(p?.notifications).toBe(true);
  });
});
