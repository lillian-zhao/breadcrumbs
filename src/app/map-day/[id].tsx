import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DayMap } from '@/components/DayMap';
import { Caption, PageHeader, Screen } from '@/components/ui';
import { getPerson } from '@/data';
import { colors } from '@/theme';

export default function FriendDayMap() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const friendId = Array.isArray(id) ? id[0] : id;
  const friend = friendId ? getPerson(friendId) : undefined;

  if (!friend) {
    return (
      <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
        <PageHeader back={{ label: 'Map' }} title={{ title: 'Not found', fontSize: 44, lineHeight: 49.28 }} />
        <Caption>That friend isn’t sharing a day on the map right now.</Caption>
      </Screen>
    );
  }

  return (
    <View style={styles.screen}>
      <PageHeader
        back={{ label: 'Map', raised: true }}
        title={{ title: `${friend.name}’s day`, fontSize: 44, lineHeight: 49.28 }}
        subtitle={`${friend.name}’s crumbs · Today, Oct 5`}
        gap={21}
        style={[styles.header, { paddingTop: insets.top + 18 }]}
      />

      <View style={styles.mapArea}>
        <DayMap
          variant="friend"
          friendId={friend.id}
          onSelectPin={(crumbId) => router.push(`/crumb/${crumbId}` as Href)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  header: {
    paddingHorizontal: 24,
    overflow: 'hidden',
  },
  mapArea: {
    flex: 1,
    overflow: 'hidden',
  },
});
