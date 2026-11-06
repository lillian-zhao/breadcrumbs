import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

export type AsyncState<T> = {
  data: T | undefined;
  error: Error | undefined;
  loading: boolean;
  reload: () => void;
};

/**
 * Run an async loader whenever the screen gains focus or `deps` change.
 * Reloading on focus keeps a screen fresh after a pushed screen writes data
 * (e.g. Edit profile → back to Profile). Stale responses are dropped.
 *
 * `deps` should be primitives (ids, dates as keys, numbers).
 */
export function useAsync<T>(load: () => Promise<T>, deps: readonly (string | number | boolean)[]): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);
  const latestLoad = useRef(load);
  // Declared before useFocusEffect, so it runs first and `run` sees the latest loader.
  useEffect(() => {
    latestLoad.current = load;
  });
  const key = JSON.stringify(deps);

  const run = useCallback(() => {
    const id = ++requestId.current;
    setLoading(true);
    latestLoad
      .current()
      .then((value) => {
        if (id !== requestId.current) return;
        setData(value);
        setError(undefined);
      })
      .catch((reason: unknown) => {
        if (id !== requestId.current) return;
        console.warn(reason);
        setError(reason instanceof Error ? reason : new Error(String(reason)));
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
    // `key` is what makes a new `run` (and so a refetch) when deps change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useFocusEffect(run);

  return { data, error, loading, reload: run };
}
