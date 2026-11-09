import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet, View } from 'react-native';

import { useFriendsMapCrumbs, useMyCrumbs } from '@/data';
import type { MapCrumb } from '@/data';
import { colors } from '@/theme';

type Variant = 'mine' | 'friends' | 'friend';

type Props = {
  variant?: Variant;
  friendId?: string;
  onSelectPin?: (id: string) => void;
  crumbs?: MapCrumb[];
};

type Pin = {
  id: string;
  title: string;
  snippet: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_CENTER = { latitude: 40.4406, longitude: -79.9959 };

/** Real map (Apple Maps on iOS, Google Maps on Android) with crumb markers. */
export function DayMap({ variant = 'mine', friendId, onSelectPin, crumbs }: Props) {
  const { data: myCrumbs = [] } = useMyCrumbs();
  const { data: friendsCrumbs = [] } = useFriendsMapCrumbs(
    variant === 'friend' ? friendId : undefined,
    variant !== 'mine',
  );

  let pins: Pin[] = [];
  if (variant === 'mine') {
    pins = (crumbs ?? myCrumbs).map((crumb) => ({
      id: crumb.id,
      title: crumb.placeName,
      snippet: crumb.city,
      latitude: crumb.latitude,
      longitude: crumb.longitude,
    }));
  } else if (variant === 'friends') {
    pins = friendsCrumbs.map((crumb) => ({
      id: crumb.id,
      title: `${crumb.friendName} · ${crumb.placeName}`,
      snippet: crumb.city,
      latitude: crumb.latitude,
      longitude: crumb.longitude,
    }));
  } else {
    pins = friendsCrumbs.map((crumb) => ({
      id: crumb.id,
      title: crumb.placeName,
      snippet: crumb.city,
      latitude: crumb.latitude,
      longitude: crumb.longitude,
    }));
  }

  const first = pins[0];
  const center = first ? { latitude: first.latitude, longitude: first.longitude } : DEFAULT_CENTER;
  const cameraPosition = { coordinates: center, zoom: 12 };

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <AppleMaps.View
          style={StyleSheet.absoluteFill}
          cameraPosition={cameraPosition}
          markers={pins.map((pin) => ({
            id: pin.id,
            title: pin.title,
            coordinates: { latitude: pin.latitude, longitude: pin.longitude },
          }))}
          onMarkerClick={(marker) => {
            if (marker.id) onSelectPin?.(marker.id);
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleMaps.View
        style={StyleSheet.absoluteFill}
        cameraPosition={cameraPosition}
        markers={pins.map((pin) => ({
          id: pin.id,
          title: pin.title,
          snippet: pin.snippet,
          coordinates: { latitude: pin.latitude, longitude: pin.longitude },
        }))}
        onMarkerClick={(marker) => {
          if (marker.id) onSelectPin?.(marker.id);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
