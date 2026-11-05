import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii, shadows } from '@/theme';

type Props = {
  icon: ImageSource;
  accessibilityLabel: string;
  onPress?: () => void;
  iconSize?: number;
  /**
   * `outlined` — 44px square with a bark border (calendar arrows).
   * `raised` — 34px cream circle with a shadow (map controls).
   * `bare` — just the icon in a 44px hit area.
   */
  variant?: 'outlined' | 'raised' | 'bare';
  style?: StyleProp<ViewStyle>;
};

export function IconButton({ icon, accessibilityLabel, onPress, iconSize = 20, variant = 'outlined', style }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.base, styles[variant], style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={variant === 'raised' ? 5 : 0}
    >
      <Image source={icon} style={{ width: iconSize, height: iconSize }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: colors.bark,
    borderRadius: radii.control,
  },
  raised: {
    width: 34,
    height: 34,
    borderRadius: radii.pill,
    backgroundColor: colors.cream,
    boxShadow: shadows.raised,
  },
  bare: {
    width: 44,
    height: 44,
  },
});
