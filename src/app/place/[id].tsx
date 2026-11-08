import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
  Avatar,
  Button,
  Caption,
  Card,
  ListRow,
  PageHeader,
  Photo,
  Screen,
  SectionHeading,
} from '@/components/ui';
import { getPerson, getPlace, savedPlaces } from '@/data';
import { colors, fonts } from '@/theme';

export default function PlaceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const placeId = Array.isArray(id) ? id[0] : id;
  const place = placeId ? getPlace(placeId) : getPlace('heytea');
  const [saved, setSaved] = useState(() => savedPlaces.some((item) => item.id === place?.id));

  if (!place) {
    return (
      <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
        <PageHeader back={{ label: 'Back' }} title={{ title: 'Not found', fontSize: 44, lineHeight: 49.28 }} />
        <Caption>That place isn’t in your crumbs yet.</Caption>
      </Screen>
    );
  }

  const friends = place.friendIds.map(getPerson).filter((person) => person != null);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Back' }}
        title={{ title: place.name, fontSize: 44, lineHeight: 49.28 }}
        subtitle={`${place.city} · ${place.category}`}
        style={styles.header}
      />

      <View style={styles.content}>
        <Photo photo={place.photo} style={styles.hero} />

        <View style={styles.actions}>
          <Button
            label={saved ? 'Saved' : 'Save'}
            variant={saved ? 'secondary' : 'primary'}
            icon={require('@assets/icons/bookmark.svg')}
            fill
            onPress={() => setSaved((value) => !value)}
          />
          <Button
            label="Log a visit"
            variant="secondary"
            icon={require('@assets/icons/plus.svg')}
            fill
            onPress={() => router.push('/log-day')}
          />
        </View>
        <Caption>
          Save it to your spots, or add this stop to today’s trail. Your original visit stays in your journal.
        </Caption>

        {friends.length > 0 && (
          <Card>
            <View style={styles.friends}>
              <View style={styles.friendStack}>
                {friends.slice(0, 3).map((friend, index) => (
                  <Avatar key={friend.id} photo={friend.avatar} size={38} style={{ marginLeft: index === 0 ? 0 : -8 }} />
                ))}
              </View>
              <View style={styles.friendCopy}>
                <Text style={styles.friendTitle}>{friends.length} friends saved this</Text>
                <Caption>{friends.map((friend) => friend.name).join(', ')}</Caption>
              </View>
            </View>
            <Caption>Following doesn’t unlock private visits — only what they choose to share.</Caption>
          </Card>
        )}

        <SectionHeading label="moments from here" fontSize={19} ruleOpacity={0.6} />
        <View style={styles.grid}>
          {place.photos.map((photo, index) => (
            <Photo key={index} photo={photo} style={styles.tile} />
          ))}
        </View>
        <Caption>{place.photos.length} photos from visits here</Caption>

        <SectionHeading label="your visits" fontSize={19} ruleOpacity={0.6} />
        {place.visits.map((visit) => (
          <ListRow
            key={visit.title}
            title={visit.title}
            subtitle={visit.subtitle}
            actionLabel="View day"
            onAction={() => router.push('/log-day')}
          />
        ))}

        <Button
          label="Open in maps"
          variant="secondary"
          icon={require('@assets/icons/map-pin-row.svg')}
          onPress={() => router.push('/map')}
        />
        <Caption>Directions use the maps app on your phone. Breadcrumbs only keeps the memory of the stop.</Caption>
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
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
  hero: {
    height: 284,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  friends: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendCopy: {
    flex: 1,
    gap: 3,
  },
  friendTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 24,
    color: colors.ink,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tile: {
    width: 174,
    height: 174,
  },
});
