import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, type StyleProp, type ViewStyle } from 'react-native';

const PITTSBURGH = { latitude: 40.4406, longitude: -79.9959 };

type Props = {
  /** Latitude of the pin; falls back to Pittsburgh when missing or 0. */
  latitude?: number | null;
  /** Longitude of the pin; falls back to Pittsburgh when missing or 0. */
  longitude?: number | null;
  /** Optional title for the pin's callout. */
  name?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * A small real map (Apple Maps on iOS, Google Maps on Android) centered on a
 * single pin. It re-centers when the coordinates change (via a remount), so it
 * follows a place search.
 */
export function LocationMap({ latitude, longitude, name, style }: Props) {
  const hasCoordinates =
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    !(latitude === 0 && longitude === 0);

  const coordinates = hasCoordinates
    ? { latitude: latitude as number, longitude: longitude as number }
    : PITTSBURGH;

  const cameraPosition = { coordinates, zoom: 14 };
  const marker = { id: 'selected', title: name, coordinates };

  // Remount on coordinate change so the map re-centers on the newly selected
  // place instead of keeping its previous viewport.
  const key = coordinates.latitude.toFixed(4) + ',' + coordinates.longitude.toFixed(4);

  if (Platform.OS === 'ios') {
    return (
      <AppleMaps.View key={key} style={style} cameraPosition={cameraPosition} markers={[marker]} />
    );
  }

  return (
    <GoogleMaps.View key={key} style={style} cameraPosition={cameraPosition} markers={[marker]} />
  );
}
