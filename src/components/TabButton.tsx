import { Image, type ImageSource } from 'expo-image';
import type { TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet } from 'react-native';

import { layout } from '@/theme';

// expo-router types `ref` as the View component type rather than its instance, which RN 0.88 rejects.
type Props = Omit<TabTriggerSlotProps, 'ref'> & {
  icon: ImageSource;
  label: string;
};

export function TabButton({ icon, label, isFocused, ...props }: Props) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isFocused }}
      hitSlop={10}
    >
      <Image source={icon} style={styles.icon} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: layout.tabBarIconSize,
    height: layout.tabBarIconSize,
  },
});
