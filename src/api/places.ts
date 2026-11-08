/**
 * Google Places API integration for place search.
 *
 * The key is read from EXPO_PUBLIC_GOOGLE_PLACES_API_KEY (set it in the
 * gitignored .env file). Expo inlines EXPO_PUBLIC_ variables into the client
 * bundle, so restrict the key to the Places API in Google Cloud and never
 * commit it.
 */

export type PlaceSearchResult = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
};

type RawResult = {
  place_id?: string;
  name?: string;
  formatted_address?: string;
  types?: string[];
  geometry?: { location?: { lat?: number; lng?: number } };
};

type RawResponse = {
  status?: string;
  results?: RawResult[];
  error_message?: string;
};

function categoryLabel(types: string[] | undefined): string {
  const raw = types && types.length > 0 ? types[0] : 'place';
  return raw.replace(/_/g, ' ');
}

/** Search places by free-text query via the Google Places Text Search API. */
export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!key) {
    console.warn('searchPlaces: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY is not set.');
    return [];
  }

  const url =
    'https://maps.googleapis.com/maps/api/place/textsearch/json?query=' +
    encodeURIComponent(query) +
    '&key=' +
    encodeURIComponent(key);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Places API request failed with status ' + response.status);
  }

  const payload = (await response.json()) as RawResponse;

  if (payload.status !== 'OK' && payload.status !== 'ZERO_RESULTS') {
    const detail = payload.error_message ? ' - ' + payload.error_message : '';
    throw new Error('Places API error: ' + (payload.status ?? 'UNKNOWN') + detail);
  }

  return (payload.results ?? []).map((result) => ({
    id: result.place_id ?? '',
    name: result.name ?? 'Unknown place',
    address: result.formatted_address ?? '',
    latitude: result.geometry?.location?.lat ?? 0,
    longitude: result.geometry?.location?.lng ?? 0,
    category: categoryLabel(result.types),
  }));
}
