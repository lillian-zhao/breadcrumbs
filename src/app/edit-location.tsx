import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Card, ListRow, PageHeader, Pill, Screen, SearchField, SectionHeading } from '@/components/ui';
import { nearbyPlaces } from '@/data';
import { colors, fonts, mapColors } from '@/theme';

export default function EditLocation() {
  const { stop: stopParam } = useLocalSearchParams<{ stop?: string }>();
  const stopId = Array.isArray(stopParam) ? stopParam[0] : stopParam;
  const initial = nearbyPlaces.find((place) => place.id === stopId) ?? nearbyPlaces[0];
  const [query, setQuery] = useState(initial.name);
  const [selectedId, setSelectedId] = useState(initial.id);
  const selected = nearbyPlaces.find((place) => place.id === selectedId) ?? nearbyPlaces[0];

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Map' }}
        title={{ title: 'Move this pin.', fontSize: 44, lineHeight: 49.28 }}
        subtitle={`Edit location · ${selected.name}`}
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

        <View style={styles.miniMap} accessibilityLabel="Edit pin on Pittsburgh map">
          <Text style={styles.mapCity}>PITTSBURGH</Text>
          <View style={[styles.block, { left: 0, top: 0, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 124, top: 0, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 248, top: 0, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 0, top: 94, backgroundColor: mapColors.park }]} />
          <View style={[styles.block, { left: 124, top: 94, backgroundColor: mapColors.block }]} />
          <View style={[styles.block, { left: 248, top: 94, backgroundColor: mapColors.block }]} />
          <View style={styles.cafeLabel}>
            <Text style={styles.cafeName}>{selected.name}</Text>
            <Text style={styles.cafeHint}>Drag to refine</Text>
          </View>
        </View>

        <SectionHeading label="suggested places" fontSize={19} ruleOpacity={0.6} />
        <Card>
          <View style={styles.selectedHead}>
            <Text style={styles.selectedName}>{selected.name}</Text>
            <Pill label="This pin" tone="selected" />
          </View>
          <Text style={styles.selectedSubtitle}>{selected.subtitle}</Text>
          {selected.detail !== undefined && <Text style={styles.selectedDetail}>{selected.detail}</Text>}
        </Card>

        {nearbyPlaces
          .filter((place) => place.id !== selected.id)
          .map((place) => (
            <ListRow
              key={place.id}
              title={place.name}
              subtitle={place.subtitle}
              actionLabel="Use"
              onAction={() => setSelectedId(place.id)}
            />
          ))}

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
    top: 118,
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.cream,
    gap: 2,
  },
  cafeName: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.ink,
  },
  cafeHint: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.caption,
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
  selectedDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
