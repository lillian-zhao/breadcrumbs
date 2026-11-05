import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, shadows } from '@/theme';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'lg';
  icon?: ImageSource;
  iconSize?: number;
  trailingIcon?: ImageSource;
  trailingIconSize?: { width: number; height: number };
  /** Share the row with sibling buttons. */
  fill?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** The full-width rounded "Action" button. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconSize = 17,
  trailingIcon,
  trailingIconSize = { width: 12, height: 12 },
  fill = false,
  disabled = false,
  style,
}: Props) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        size === 'lg' ? styles.large : styles.medium,
        isPrimary ? styles.primary : styles.secondary,
        fill && styles.fill,
        (pressed || disabled) && styles.dimmed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {icon && <Image source={icon} style={{ width: iconSize, height: iconSize }} />}
      <Text
        style={[
          styles.label,
          size === 'lg' && styles.largeLabel,
          { color: isPrimary ? colors.white : colors.bark },
        ]}
      >
        {label}
      </Text>
      {trailingIcon && <Image source={trailingIcon} style={[trailingIconSize, styles.trailingIcon]} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  medium: {
    minHeight: 48,
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  large: {
    height: 57,
    gap: 6,
    paddingHorizontal: 12,
    boxShadow: shadows.soft,
  },
  primary: {
    backgroundColor: colors.crumb,
    borderColor: 'transparent',
  },
  secondary: {
    borderColor: colors.sand,
  },
  fill: {
    flex: 1,
  },
  dimmed: {
    opacity: 0.8,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  largeLabel: {
    fontSize: 16,
  },
  trailingIcon: {
    transform: [{ scaleX: -1 }],
  },
});
