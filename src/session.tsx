import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';

import { currentUser } from '@/data';

type Session = {
  userId: string;
  name: string;
  handle: string;
};

type SessionContextValue = {
  session: Session | null;
  signIn: () => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);
const STORAGE_KEY = 'breadcrumbs.session';

function asSession(value: unknown): Session | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (typeof record.userId !== 'string' || typeof record.name !== 'string' || typeof record.handle !== 'string') {
    return null;
  }
  return { userId: record.userId, name: record.name, handle: record.handle };
}

function readSession(): Session | null {
  if (Platform.OS !== 'web') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? asSession(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  if (Platform.OS !== 'web') return;
  try {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage can be unavailable in private mode.
  }
}

/** Mock session until Firebase Auth exists. Any sign-in method becomes the seeded user. */
export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(readSession);

  const signIn = useCallback(() => {
    const next = { userId: currentUser.id, name: currentUser.name, handle: currentUser.handle };
    writeSession(next);
    setSession(next);
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setSession(null);
  }, []);

  const value = useMemo(() => ({ session, signIn, signOut }), [session, signIn, signOut]);

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return value;
}
