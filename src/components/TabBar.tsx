import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '@/theme';

type Tab = {
  key: string;
  label: string;
  icon: ImageSource;
};

const tabs: Tab[] = [
  { key: 'profile', label: 'Profile', icon: require('@assets/home/nav-user.png') },
  { key: 'home', label: 'Home', icon: require('@assets/home/nav-home.png') },
  { key: 'map', label: 'Map', icon: require('@assets/home/nav-map.png') },
  { key: 'gallery', label: 'Gallery', icon: require('@assets/home/nav-gallery.png') },
  { key: 'friends', label: 'Friends', icon: require('@assets/home/nav-friends.png') },
];

type Props = {
  active: string;
  onSelect?: (key: string) => void;
};

export function TabBar({ active, onSelect }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.bar, { bottom: Math.max(insets.bottom, layout.tabBarBottom) }]}
      pointerEvents="box-none"
      accessibilityRole="tablist"
    >
      {tabs.map((tab) => (
        <Pressable
          key={tab.key}
          onPress={() => onSelect?.(tab.key)}
          accessibilityRole="tab"
          accessibilityLabel={tab.label}
          accessibilityState={{ selected: tab.key === active }}
          hitSlop={10}
        >
          <Image source={tab.icon} style={styles.icon} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 29,
  },
  icon: {
    width: layout.tabBarIconSize,
    height: layout.tabBarIconSize,
  },
});
