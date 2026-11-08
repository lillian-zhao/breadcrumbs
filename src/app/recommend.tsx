import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Caption,
  PageHeader,
  Pill,
  PlaceCard,
  Screen,
  SearchField,
  SectionHeading,
  StatusMessage,
} from '@/components/ui';
import { getPerson, places } from '@/data';

type Filter = 'all' | 'Coffee' | 'Italian' | 'Bar' | 'Tea';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Italian', label: 'Italian' },
  { value: 'Bar', label: 'Bar' },
  { value: 'Tea', label: 'Tea' },
];

export default function FriendRecommendations() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(['park-cafe']);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return places.filter((place) => {
      if (filter !== 'all' && place.category !== filter) return false;
      if (nearbyOnly && place.city !== 'Pittsburgh') return false;
      if (!needle) return true;
      const friends = place.friendIds.map((id) => getPerson(id)?.name ?? '').join(' ');
      return `${place.name} ${place.city} ${place.category} ${friends}`.toLowerCase().includes(needle);
    });
  }, [filter, nearbyOnly, query]);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Friends' }}
        title={{ title: 'Friend recs.', fontSize: 44, lineHeight: 49.28 }}
        subtitle="Places your people saved · Pittsburgh and a little farther"
        style={styles.header}
      />

      <View style={styles.content}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search places friends love" />

        <View style={styles.filters}>
          {filters.map((item) => (
            <Pill
              key={item.value}
              label={item.label}
              tone={filter === item.value ? 'selected' : 'muted'}
              onPress={() => setFilter(item.value)}
            />
          ))}
          <Pill
            label="Filters"
            icon={require('@assets/icons/sliders.svg')}
            tintIcons
            tone={showFilters ? 'selected' : 'default'}
            onPress={() => setShowFilters((value) => !value)}
          />
        </View>

        {showFilters && (
          <View style={styles.extra}>
            <Pill
              label="Nearby"
              icon={require('@assets/icons/map-pin-chip.svg')}
              tintIcons
              tone={nearbyOnly ? 'selected' : 'default'}
              onPress={() => setNearbyOnly((value) => !value)}
            />
            <Caption>Nearby keeps Pittsburgh. Saved-by-friends is already this list.</Caption>
          </View>
        )}

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="From people you follow"
          body="These are spots friends chose to share. Opening a place never follows them into a private day."
        />

        <SectionHeading label="recommended" fontSize={19} ruleOpacity={0.6} />
        {results.map((place) => {
          const names = place.friendIds.map((id) => getPerson(id)?.name).filter((name): name is string => !!name);
          const saved = savedIds.includes(place.id);
          return (
            <PlaceCard
              key={place.id}
              photo={place.photo}
              title={place.name}
              subtitle={`${place.city} · ${place.category}`}
              caption={names.length ? `Saved by ${names.slice(0, 2).join(' & ')}` : 'A friend recommended this'}
              bookmarked={saved}
              onPress={() => router.push(`/place/${place.id}` as Href)}
              onBookmark={() =>
                setSavedIds((ids) => (ids.includes(place.id) ? ids.filter((id) => id !== place.id) : [...ids, place.id]))
              }
            />
          );
        })}
        {results.length === 0 && (
          <Caption>
            {query.trim()
              ? `No friend recs match “${query.trim()}”. Try another place or filter.`
              : 'No friend recs for this filter yet.'}
          </Caption>
        )}
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
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  extra: {
    gap: 10,
  },
});
