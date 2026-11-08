import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Card, ListRow, PageHeader, Pill, Screen, SearchField, SectionHeading } from '@/components/ui';
import { nearbyPlaces } from '@/data';
import { usePlaceSearch } from '@/hooks/usePlaceSearch';
import { colors, fonts, mapColors } from '@/theme';

type Suggestion = { id: string; name: string; subtitle: string };

export default function ChooseLocation() {
  const [query, setQuery] = useState('Cafe');
  const { results, loading } = usePlaceSearch(query);

  const suggestions: Suggestion[] =
    results.length > 0
      ? results.map((place) => ({
          id: place.id,
          name: place.name,
          subtitle: place.address || place.category,
        }))
      : nearbyPlaces.map((place) => ({ id: place.id, name: place.name, subtitle: place.subtitle }));

  const [selectedId, setSelectedId] = useState<string>(nearbyPlaces[0].id);
  const selected = suggestions.find((s) => s.id === selectedId) ?? suggestions[0];

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

        <View style={styles.miniMap} accessibilityLabel="Pittsburgh neighborhood map">
          <Text style={styles.mapCity}>PITTSBURGH</Text>
          <View style={[styles.block, { left: 0, top: 0, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 124, top: 0, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 248, top: 0, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 0, top: 94, backgroundColor: mapColors.park }]} />
          <View style={[styles.block, { left: 124, top: 94, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 248, top: 94, backgroundColor: mapColors.block }]} />
          <View style={styles.cafeLabel}>
            <Text style={styles.cafeName}>{selected?.name ?? ''}</Text>
          </View>
        </View>

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
          <Button label={selected ? 'Confirm ' + selected.name : 'Confirm'} fill onPress={() => router.back()} />
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
    backgroundColor: mapColors.street,
  },
  mapCity: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 1,
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.bark,
  },
  block: {
    position: 'absolute',
    width: 110,
    height: 80,
  },
  cafeLabel: {
    position: 'absolute',
    left: 196,
    top: 126,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.cream,
  },
  cafeName: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.ink,
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
