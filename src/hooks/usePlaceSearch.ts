import { useEffect, useState } from 'react';

import { searchPlaces, type PlaceSearchResult } from '@/api/places';

/** Debounced Google Places search for a free-text query. */
export function usePlaceSearch(query: string) {
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const needle = query.trim();
    if (!needle) {
      const reset = setTimeout(() => {
        setResults([]);
        setLoading(false);
      }, 0);
      return () => clearTimeout(reset);
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      searchPlaces(needle)
        .then((places) => {
          if (!cancelled) setResults(places);
        })
        .catch((error) => {
          if (!cancelled) console.warn(error);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  return { results, loading };
}
