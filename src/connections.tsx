import { createContext, use, useCallback, useMemo, type PropsWithChildren } from 'react';

import { getCurrentUserId, useAuthUser } from '@/api/auth';
import { api } from '@/api/client';
import { useAsync } from '@/hooks/useAsync';

type Connections = {
  followingIds: ReadonlySet<string>;
  isFollowing: (id: string) => boolean;
  follow: (id: string) => Promise<void>;
  unfollow: (id: string) => Promise<void>;
  toggleFollow: (id: string) => Promise<void>;
};

const ConnectionsContext = createContext<Connections | null>(null);

/** Accepted friends of the signed-in user, backed by Firestore friendships. */
export function ConnectionsProvider({ children }: PropsWithChildren) {
  useAuthUser();
  const userId = getCurrentUserId() ?? '';

  const { data: friends = [], reload } = useAsync(
    async () => (userId ? api.friends.list({ userId }, userId) : []),
    [userId],
  );

  const followingIds = useMemo(() => new Set(friends.map((friend) => friend.id)), [friends]);

  const follow = useCallback(
    async (id: string) => {
      if (!userId) return;
      await api.friends.request({ userId }, id);
      reload();
    },
    [userId, reload],
  );

  const unfollow = useCallback(
    async (id: string) => {
      if (!userId) return;
      await api.friends.unfriend({ userId }, id);
      reload();
    },
    [userId, reload],
  );

  const toggleFollow = useCallback(
    async (id: string) => {
      if (followingIds.has(id)) await unfollow(id);
      else await follow(id);
    },
    [followingIds, follow, unfollow],
  );

  const value = useMemo<Connections>(
    () => ({
      followingIds,
      isFollowing: (id) => followingIds.has(id),
      follow,
      unfollow,
      toggleFollow,
    }),
    [followingIds, follow, unfollow, toggleFollow],
  );

  return <ConnectionsContext.Provider value={value}>{children}</ConnectionsContext.Provider>;
}

export function useConnections() {
  const value = use(ConnectionsContext);
  if (!value) {
    throw new Error('useConnections must be used within a ConnectionsProvider');
  }
  return value;
}
