import { createContext, use, useMemo, type PropsWithChildren } from 'react';

import { signIn as fbSignIn, signOut as fbSignOut, signUp as fbSignUp, useAuthUser } from '@/api/auth';

type Session = {
  userId: string;
};

type SessionContextValue = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | null>(null);

/** Session backed by Firebase Auth. The user profile lives in Firestore users/{uid}. */
export function SessionProvider({ children }: PropsWithChildren) {
  const user = useAuthUser();

  const value = useMemo<SessionContextValue>(
    () => ({
      session: user ? { userId: user.uid } : null,
      signIn: async (email, password) => {
        await fbSignIn(email, password);
      },
      signUp: async (email, password, name) => {
        await fbSignUp(email, password, name);
      },
      signOut: async () => {
        await fbSignOut();
      },
    }),
    [user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = use(SessionContext);
  if (!value) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return value;
}
