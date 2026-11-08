import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Avatar, Caption, PageHeader, Pill, PlaceCard, Screen, SearchField, SectionHeading, StatusMessage } from '@/components/ui';
import { getPerson, savedPlaces } from '@/data';
import { colors, fonts } from '@/theme';

export default function FriendPlaces() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const friendId = Array.isArray(id) ? id[0] : id;
  const friend = friendId ? getPerson(friendId) : undefined;
  const [query, setQuery] = useState('');
  const places = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const visible = savedPlaces.slice(0, 2);
    if (!needle) return visible;
    return visible.filter(
      (place) => place.name.toLowerCase().includes(needle) || place.category.toLowerCase().includes(needle),
    );
  }, [query]);

  if (!friend) {
    return (
      <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
        <PageHeader back={{ label: 'Back' }} title={{ title: 'Not found', fontSize: 44, lineHeight: 49.28 }} />
        <Caption>That friend isn’t in your circle yet.</Caption>
      </Screen>
    );
  }

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Back' }}
        title={{ title: 'Saved places', fontSize: 44, lineHeight: 49.28 }}
        subtitle={`Places ${friend.name} chooses to share`}
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.author}>
          <Avatar photo={friend.avatar} size={52} />
          <View style={styles.authorText}>
            <Text style={styles.authorName}>{friend.name}</Text>
            <Caption>{friend.handle} · Shared collection</Caption>
          </View>
        </View>

        <SearchField value={query} onChangeText={setQuery} placeholder={`Search ${friend.name}’s spots`} />

        <View style={styles.controls}>
          <Pill label="List" tone="selected" />
          <Pill
            label="Map"
            icon={require('@assets/icons/map-pin-chip.svg')}
            tintIcons
            onPress={() => router.push('/map')}
          />
        </View>

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="Only what they share"
          body={`${friend.name} chooses which saved spots you can see. Private bookmarks stay private.`}
        />

        <SectionHeading label="shared spots" fontSize={19} ruleOpacity={0.6} />
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            photo={place.photo}
            title={place.name}
            subtitle={`${place.category} • ${place.price}`}
            caption={`Saved by ${friend.name} · View place ↗`}
            onPress={() => router.push(`/place/${place.id}` as Href)}
          />
        ))}
        {places.length === 0 && <Caption>No shared spots match that search.</Caption>}
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
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorText: {
    flex: 1,
    gap: 4,
  },
  authorName: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
});
