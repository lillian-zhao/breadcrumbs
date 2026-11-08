import { createContext, use, useCallback, useMemo, type PropsWithChildren } from 'react';

import { getCurrentUserId, useAuthUser } from '@/api/auth';
import { api } from '@/api/client';
import { useAsync } from '@/hooks/useAsync';

type Connections = {
  followingIds: ReadonlySet<string>;
  requestedIds: ReadonlySet<string>;
  isFollowing: (id: string) => boolean;
  isRequested: (id: string) => boolean;
  follow: (id: string) => Promise<void>;
  unfollow: (id: string) => Promise<void>;
  toggleFollow: (id: string) => Promise<void>;
};

const ConnectionsContext = createContext<Connections | null>(null);

/** Accepted friends and outgoing requests of the signed-in user, backed by Firestore. */
export function ConnectionsProvider({ children }: PropsWithChildren) {
  useAuthUser();
  const userId = getCurrentUserId() ?? '';

  const { data, reload } = useAsync(
    async () => {
      if (!userId) return { following: [] as string[], requested: [] as string[] };
      const [friends, outgoing] = await Promise.all([
        api.friends.list({ userId }, userId),
        api.friends.outgoing(userId),
      ]);
      return {
        following: friends.map((friend) => friend.id),
        requested: outgoing.map((req) => req.userId),
      };
    },
    [userId],
  );

  const followingIds = useMemo(() => new Set(data?.following ?? []), [data]);
  const requestedIds = useMemo(() => new Set(data?.requested ?? []), [data]);

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
      requestedIds,
      isFollowing: (id) => followingIds.has(id),
      isRequested: (id) => requestedIds.has(id),
      follow,
      unfollow,
      toggleFollow,
    }),
    [followingIds, requestedIds, follow, unfollow, toggleFollow],
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
