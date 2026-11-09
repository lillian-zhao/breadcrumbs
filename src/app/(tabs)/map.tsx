import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DayMap } from '@/components/DayMap';
import { PageHeader, SegmentedControl } from '@/components/ui';
import { currentUser } from '@/data';
import { colors } from '@/theme';

type MapView = 'mine' | 'friends';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<MapView>('mine');

  return (
    <View style={styles.screen}>
      <PageHeader
        back={{ raised: true }}
        title={{ title: 'Map', fontSize: 64, lineHeight: 70.4, ornaments: 'map', height: 78 }}
        subtitle={
          view === 'friends'
            ? 'Friends nearby · Today, Oct 5'
            : `${currentUser.name}’s crumbs · Today, Oct 5`
        }
        gap={21}
        style={[styles.header, { paddingTop: insets.top + 18, height: insets.top + 256 }]}
      >
        <SegmentedControl
          compact
          segments={[
            { value: 'mine', label: 'My Crumbs' },
            { value: 'friends', label: 'Friends' },
          ]}
          value={view}
          onChange={setView}
        />
      </PageHeader>

      <View style={styles.mapArea}>
        <DayMap
          variant={view === 'friends' ? 'friends' : 'mine'}
          onSelectPin={(id) => {
            if (view === 'friends') router.push(`/crumb/${id}` as Href);
            else router.push(`/edit-location?stop=${id}` as Href);
          }}
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
