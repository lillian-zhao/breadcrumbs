import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Card, ListRow, PageHeader, Pill, Screen, SearchField, SectionHeading } from '@/components/ui';
import { nearbyPlaces } from '@/data';
import { colors, fonts, mapColors } from '@/theme';

export default function ChooseLocation() {
  const [query, setQuery] = useState('Cafe');
  const [selectedId, setSelectedId] = useState(
    nearbyPlaces.find((place) => place.status === 'selected')?.id ?? nearbyPlaces[0].id,
  );
  const selected = nearbyPlaces.find((place) => place.id === selectedId) ?? nearbyPlaces[0];

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
            <Text style={styles.cafeName}>{selected.name}</Text>
          </View>
        </View>

        <SectionHeading label="nearby places" fontSize={19} ruleOpacity={0.6} />
        <Card>
          <View style={styles.selectedHead}>
            <Text style={styles.selectedName}>{selected.name}</Text>
            <Pill label="Selected" tone="selected" />
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
              actionLabel={place.status === 'added' ? 'Added' : 'Choose'}
              onAction={place.status === 'choose' ? () => setSelectedId(place.id) : undefined}
            />
          ))}

        <Caption>Not the right spot? Search a place name or move the map to refine nearby results.</Caption>
        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => router.back()} />
          <Button label={`Confirm ${selected.name}`} fill onPress={() => router.back()} />
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
