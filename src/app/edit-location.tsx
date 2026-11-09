import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LocationMap } from '@/components/LocationMap';
import { Button, Caption, Card, ListRow, PageHeader, Pill, Screen, SearchField, SectionHeading } from '@/components/ui';
import { nearbyPlaces } from '@/data';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { colors, fonts } from '@/theme';

type Suggestion = { id: string; name: string; subtitle: string; latitude?: number; longitude?: number };

export default function EditLocation() {
  const { stop: stopParam } = useLocalSearchParams<{ stop?: string }>();
  const stopId = Array.isArray(stopParam) ? stopParam[0] : stopParam;
  const initial = nearbyPlaces.find((place) => place.id === stopId) ?? nearbyPlaces[0];
  const [query, setQuery] = useState(initial.name);
  const { results, loading } = usePlaceSearch(query);

  const suggestions: Suggestion[] =
    results.length > 0
      ? results.map((place) => ({
          id: place.id,
          name: place.name,
          subtitle: place.address || place.category,
          latitude: place.latitude,
          longitude: place.longitude,
        }))
      : nearbyPlaces.map((place) => ({ id: place.id, name: place.name, subtitle: place.subtitle }));

  const [selectedId, setSelectedId] = useState<string>(initial.id);
  const selected = suggestions.find((s) => s.id === selectedId) ?? suggestions[0];

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Map' }}
        title={{ title: 'Move this pin.', fontSize: 44, lineHeight: 49.28 }}
        subtitle={'Edit location · ' + (selected?.name ?? '')}
        style={styles.header}
      />

      <View style={styles.content}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search a place" />
        <ListRow
          icon={require('@assets/icons/locate-fixed.svg')}
          title="Snap to current location"
          subtitle="Pittsburgh, Pennsylvania"
          actionLabel="Locate"
        />

        <LocationMap
          latitude={selected?.latitude}
          longitude={selected?.longitude}
          name={selected?.name}
          style={styles.miniMap}
        />

        <SectionHeading label="suggested places" fontSize={19} ruleOpacity={0.6} />
        <Card>
          <View style={styles.selectedHead}>
            <Text style={styles.selectedName}>{selected?.name ?? 'Pick a place'}</Text>
            <Pill label={loading ? 'Searching…' : 'This pin'} tone="selected" />
          </View>
          {selected && <Text style={styles.selectedSubtitle}>{selected.subtitle}</Text>}
        </Card>

        {suggestions
          .filter((s) => s.id !== selected?.id)
          .map((s) => (
            <ListRow key={s.id} title={s.name} subtitle={s.subtitle} actionLabel="Use" onAction={() => setSelectedId(s.id)} />
          ))}

        {loading && <Caption>Searching places…</Caption>}
        <Caption>This only moves the pin on today’s trail. The original time and photos stay with the stop.</Caption>
        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => router.back()} />
          <Button label="Save pin" fill onPress={() => router.back()} />
        </View>
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
  miniMap: {
    height: 190,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: colors.paper,
  },
  selectedHead: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  selectedName: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 27,
    color: colors.ink,
  },
  selectedSubtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.caption,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
