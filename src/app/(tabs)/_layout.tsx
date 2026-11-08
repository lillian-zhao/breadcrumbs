import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabButton } from '@/components/TabButton';
import { layout } from '@/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList style={[styles.bar, { bottom: Math.max(insets.bottom, layout.tabBarBottom) }]}>
        <TabTrigger name="profile" href="/profile" asChild>
          <TabButton label="Profile" icon={require('@assets/icons/tab-profile.png')} />
        </TabTrigger>
        <TabTrigger name="index" href="/" asChild>
          <TabButton label="Home" icon={require('@assets/icons/tab-home.png')} />
        </TabTrigger>
        <TabTrigger name="map" href="/map" asChild>
          <TabButton label="Map" icon={require('@assets/icons/tab-map.png')} />
        </TabTrigger>
        <TabTrigger name="friends" href="/friends" asChild>
          <TabButton label="Friends" icon={require('@assets/icons/tab-friends.png')} />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  // TabSlot's container defaults to flexShrink: 0, which lets screens outgrow the viewport and breaks scrolling.
  slot: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 29,
  },
});
