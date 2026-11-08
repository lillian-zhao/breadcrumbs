import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Caption, PageHeader, Pill, PlaceCard, Screen, SearchField, SectionHeading } from '@/components/ui';
import { removeSavedPlace, useCurrentUser, useSavedPlaces } from '@/data';

type CollectionView = 'list' | 'map';

export default function SavedSpots() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<CollectionView>('list');
  const { data: currentUser } = useCurrentUser();
  const { data: savedPlaces = [], reload } = useSavedPlaces();
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const remove = (placeId: string) => {
    // Hide it right away; the reload afterwards reflects what actually got saved.
    setRemovedIds((ids) => [...ids, placeId]);
    removeSavedPlace(placeId).catch(console.warn).finally(reload);
  };

  const places = useMemo(() => {
    const visible = savedPlaces.filter((place) => !removedIds.includes(place.id));
    const needle = query.trim().toLowerCase();
    if (!needle) return visible;
    return visible.filter(
      (place) =>
        place.name.toLowerCase().includes(needle) ||
        place.category.toLowerCase().includes(needle),
    );
  }, [query, savedPlaces, removedIds]);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Profile' }}
        title={{ title: 'Saved spots', fontSize: 44, lineHeight: 49.28 }}
        subtitle={currentUser ? `${currentUser.name} · All your saved places` : 'All your saved places'}
        style={styles.header}
      />

      <View style={styles.content}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search your saved spots" />

        <View style={styles.controls}>
          <Pill
            label="List"
            icon={require('@assets/icons/list.svg')}
            tintIcons
            tone={view === 'list' ? 'selected' : 'default'}
            onPress={() => setView('list')}
          />
          <Pill
            label="Map"
            icon={require('@assets/icons/map-pin-chip.svg')}
            tintIcons
            tone={view === 'map' ? 'selected' : 'default'}
            onPress={() => router.push('/map')}
          />
          <Pill label="All places" />
        </View>

        <SectionHeading label="your collection" fontSize={19} ruleOpacity={0.6} />
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            photo={place.photo}
            title={place.name}
            subtitle={`${place.category} • ${place.price}`}
            caption="Saved to your spots · View place ↗"
            onPress={() => router.push(`/place/${place.id}` as Href)}
            onBookmark={() => remove(place.id)}
          />
        ))}

        <Caption>
          Your original saved collection, all in one place. Tap a bookmark to remove a save, or open a place for photos and
          visits.
        </Caption>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  content: {
    gap: 22,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
});
