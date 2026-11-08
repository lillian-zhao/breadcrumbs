/**
 * Google Places API (New) integration for place search.
 *
 * Uses the "Search Text" endpoint of the Places API (New). The key is read
 * from EXPO_PUBLIC_GOOGLE_PLACES_API_KEY (set it in the gitignored .env file).
 * Enable "Places API (New)" for that key in Google Cloud Console.
 */

export type PlaceSearchResult = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
};

type RawPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  types?: string[];
  primaryType?: string;
};

type RawResponse = {
  places?: RawPlace[];
  error?: { message?: string };
};

function categoryLabel(value: string | undefined): string {
  return (value ?? 'place').replace(/_/g, ' ');
}

/** Search places by free-text query via the Places API (New) Search Text. */
export async function searchPlaces(query: string): Promise<PlaceSearchResult[]> {
  const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!key) {
    console.warn('searchPlaces: EXPO_PUBLIC_GOOGLE_PLACES_API_KEY is not set.');
    return [];
  }

  const fieldMask = 'places.id,places.displayName,places.formattedAddress,places.location,places.types,places.primaryType';

  const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': fieldMask,
    },
    body: JSON.stringify({ textQuery: query }),
  });

  if (!response.ok) {
    let detail = await response.text().catch(() => '');
    try {
      const parsed = JSON.parse(detail) as { error?: { message?: string } };
      if (parsed.error?.message) detail = parsed.error.message;
    } catch {
      // keep the raw body
    }
    throw new Error('Places API request failed: ' + detail);
  }

  const payload = (await response.json()) as RawResponse;

  return (payload.places ?? []).map((place) => ({
    id: place.id ?? '',
    name: place.displayName?.text ?? 'Unknown place',
    address: place.formattedAddress ?? '',
    latitude: place.location?.latitude ?? 0,
    longitude: place.location?.longitude ?? 0,
    category: categoryLabel(place.primaryType ?? place.types?.[0]),
  }));
}
