import { AppleMaps, GoogleMaps } from 'expo-maps';
import { Platform, StyleSheet, View } from 'react-native';

import { getCrumbsForFriend, getPerson, nearbyFriendPins, useMyCrumbs } from '@/data';
import { colors } from '@/theme';

type Variant = 'mine' | 'friends' | 'friend';

type Props = {
  variant?: Variant;
  friendId?: string;
  onSelectPin?: (id: string) => void;
};

type Pin = {
  id: string;
  title: string;
  snippet: string;
  latitude: number;
  longitude: number;
};

const PITTSBURGH = { latitude: 40.4406, longitude: -79.9959 };

// Fallback demo coordinates for friend pins that don't carry lat/lng yet.
const COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  'annie-aespa': { latitude: 40.447, longitude: -80.0032 },
  'alicia-park': { latitude: 40.4406, longitude: -79.9359 },
  'maggie-rooftop': { latitude: 40.4469, longitude: -80.0032 },
  'alicia-pottery': { latitude: 42.3736, longitude: -71.1097 },
};

function coordinatesFor(id: string) {
  return COORDINATES[id] ?? PITTSBURGH;
}

/** Real map (Apple Maps on iOS, Google Maps on Android) with crumb markers. */
export function DayMap({ variant = 'mine', friendId, onSelectPin }: Props) {
  const { data: myCrumbs = [] } = useMyCrumbs();
  const friendCrumbs = friendId ? getCrumbsForFriend(friendId) : [];

  let pins: Pin[] = [];
  if (variant === 'mine') {
    pins = myCrumbs.map((crumb) => ({
      id: crumb.id,
      title: crumb.placeName,
      snippet: crumb.city,
      latitude: crumb.latitude,
      longitude: crumb.longitude,
    }));
  } else if (variant === 'friends') {
    pins = nearbyFriendPins.map((pin) => {
      const person = getPerson(pin.friendId);
      return {
        id: pin.friendId,
        title: person ? person.name + ' · ' + pin.place : pin.place,
        snippet: pin.detail,
        ...coordinatesFor(pin.crumbId),
      };
    });
  } else {
    pins = friendCrumbs.map((crumb) => ({
      id: crumb.id,
      title: crumb.place,
      snippet: crumb.time + ' · ' + crumb.city,
      ...coordinatesFor(crumb.id),
    }));
  }

  const first = pins[0];
  const center = first ? { latitude: first.latitude, longitude: first.longitude } : PITTSBURGH;
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
