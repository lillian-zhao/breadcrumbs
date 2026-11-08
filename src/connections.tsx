import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

import { initialFollowingIds } from '@/data';

type Connections = {
  followingIds: ReadonlySet<string>;
  isFollowing: (id: string) => boolean;
  follow: (id: string) => void;
  unfollow: (id: string) => void;
  toggleFollow: (id: string) => void;
};

const ConnectionsContext = createContext<Connections | null>(null);

export function ConnectionsProvider({ children }: PropsWithChildren) {
  const [followingIds, setFollowingIds] = useState(() => new Set(initialFollowingIds));

  const follow = useCallback((id: string) => {
    setFollowingIds((current) => new Set(current).add(id));
  }, []);

  const unfollow = useCallback((id: string) => {
    setFollowingIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo<Connections>(
    () => ({
      followingIds,
      isFollowing: (id) => followingIds.has(id),
      follow,
      unfollow,
      toggleFollow: (id) => {
        if (followingIds.has(id)) unfollow(id);
        else follow(id);
      },
    }),
    [followingIds, follow, unfollow],
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
