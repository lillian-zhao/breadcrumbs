import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LocationMap } from '@/components/LocationMap';
import { Button, Caption, Card, ListRow, PageHeader, Pill, Screen, SearchField, SectionHeading } from '@/components/ui';
import { createCrumb, nearbyPlaces } from '@/data';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { colors, fonts } from '@/theme';

type Suggestion = { id: string; name: string; subtitle: string; latitude?: number; longitude?: number };

export default function ChooseLocation() {
  const [query, setQuery] = useState('Cafe');
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

  const [selectedId, setSelectedId] = useState<string>(nearbyPlaces[0].id);
  const selected = suggestions.find((s) => s.id === selectedId) ?? suggestions[0];
  const [saving, setSaving] = useState(false);

  const confirm = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await createCrumb({
        placeName: selected.name,
        city: 'Pittsburgh',
        visitedAt: new Date(),
        note: null,
        audience: 'private',
        latitude: selected.latitude ?? null,
        longitude: selected.longitude ?? null,
      });
      router.back();
    } catch (error) {
      console.warn(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Log a Day' }}
        title={{ title: 'A little stop', fontSize: 44, lineHeight: 49.28 }}
        subtitle="Add a place to Today, Oct 5"
        style={styles.header}
      />

      <View style={styles.content}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search a place" />
        <ListRow
          icon={require('@assets/icons/locate-fixed.svg')}
          title="Use current location"
          subtitle="Pittsburgh, Pennsylvania"
          actionLabel="Locate"
        />

        <LocationMap
          latitude={selected?.latitude}
          longitude={selected?.longitude}
          name={selected?.name}
          style={styles.miniMap}
        />

        <SectionHeading label="nearby places" fontSize={19} ruleOpacity={0.6} />
        <Card>
          <View style={styles.selectedHead}>
            <Text style={styles.selectedName}>{selected?.name ?? 'Pick a place'}</Text>
            <Pill label={loading ? 'Searching…' : 'Selected'} tone="selected" />
          </View>
          {selected && <Text style={styles.selectedSubtitle}>{selected.subtitle}</Text>}
        </Card>

        {suggestions
          .filter((s) => s.id !== selected?.id)
          .map((s) => (
            <ListRow key={s.id} title={s.name} subtitle={s.subtitle} actionLabel="Choose" onAction={() => setSelectedId(s.id)} />
          ))}

        {loading && <Caption>Searching places…</Caption>}
        <Caption>Not the right spot? Search a place name to refine nearby results.</Caption>
        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => router.back()} />
          <Button label={saving ? 'Saving…' : selected ? 'Confirm ' + selected.name : 'Confirm'} fill onPress={saving ? undefined : confirm} />
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
