import { describe, expect, it } from '@jest/globals';
import { createApi, PermissionDeniedError } from '@/api';
import { MemoryStore } from '@/api/testing/memory-store';

const alicia = { userId: 'alicia' };

describe('accounts.list', () => {
  it('lists linked accounts for self', async () => {
    const s = new MemoryStore().user('alicia').linkedAccount('alicia', 'google', true);
    const api = createApi({ store: s });

    const list = await api.accounts.list(alicia, 'alicia');

    expect(list).toEqual([{ provider: 'google', connected: true }]);
  });

  it('denies a stranger', async () => {
    const s = new MemoryStore().user('lillian').linkedAccount('lillian', 'google', true);
    const api = createApi({ store: s });
    await expect(api.accounts.list(alicia, 'lillian')).rejects.toThrow(PermissionDeniedError);
  });
});
