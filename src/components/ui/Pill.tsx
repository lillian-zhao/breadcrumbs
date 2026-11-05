import { Image, type ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, shadows } from '@/theme';

export type PillTone = 'default' | 'selected' | 'outline' | 'muted' | 'toast' | 'plain';
export type PillSize = 'tag' | 'choice' | 'chip' | 'action';

type Props = {
  label: string;
  tone?: PillTone;
  size?: PillSize;
  icon?: ImageSource;
  trailingIcon?: ImageSource;
  /** Recolor single-color icons to match the label. */
  tintIcons?: boolean;
  raised?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

const toneStyles: Record<PillTone, { container: ViewStyle; text: string }> = {
  default: { container: { backgroundColor: colors.cream, borderWidth: 1, borderColor: colors.sand }, text: colors.bark },
  selected: { container: { backgroundColor: colors.crumb, borderWidth: 1, borderColor: colors.crumb }, text: colors.white },
  outline: { container: { borderWidth: 1, borderColor: colors.sand }, text: colors.bark },
  muted: { container: { backgroundColor: colors.paper, borderWidth: 1, borderColor: colors.sand }, text: colors.taupe },
  toast: { container: { backgroundColor: colors.toast }, text: colors.white },
  plain: { container: { backgroundColor: colors.cream }, text: colors.bark },
};

const sizeStyles: Record<PillSize, { container: ViewStyle; fontSize: number; iconSize: number; trailingIconSize: number }> = {
  tag: { container: { paddingHorizontal: 10, paddingVertical: 6, gap: 6 }, fontSize: 12, iconSize: 12, trailingIconSize: 12 },
  choice: { container: { paddingHorizontal: 12, paddingVertical: 8, gap: 6 }, fontSize: 12, iconSize: 14, trailingIconSize: 14 },
  chip: {
    container: { paddingHorizontal: 13, paddingVertical: 7, gap: 5, borderRadius: 20 },
    fontSize: 13,
    iconSize: 13,
    trailingIconSize: 11,
  },
  action: { container: { paddingHorizontal: 12, paddingVertical: 7, gap: 6 }, fontSize: 13, iconSize: 14, trailingIconSize: 14 },
};

/** The rounded "Choice" element: filters, tags, audience pickers and small inline actions. */
export function Pill({
  label,
  tone = 'default',
  size = 'choice',
  icon,
  trailingIcon,
  tintIcons = false,
  raised = false,
  onPress,
  accessibilityLabel,
  style,
}: Props) {
  const toneStyle = toneStyles[tone];
  const sizeStyle = sizeStyles[size];
  const tintColor = tintIcons ? (tone === 'muted' ? colors.muted : toneStyle.text) : undefined;
  const containerStyle = [styles.pill, sizeStyle.container, toneStyle.container, raised && styles.raised, style];

  const content = (
    <>
      {icon && <Image source={icon} tintColor={tintColor} style={{ width: sizeStyle.iconSize, height: sizeStyle.iconSize }} />}
      <Text style={[styles.label, { fontSize: sizeStyle.fontSize, color: toneStyle.text }]}>{label}</Text>
      {trailingIcon && (
        <Image
          source={trailingIcon}
          tintColor={tintColor}
          style={{ width: sizeStyle.trailingIconSize, height: sizeStyle.trailingIconSize }}
        />
      )}
    </>
  );

  if (!onPress) {
    return <View style={containerStyle}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={containerStyle}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected: tone === 'selected' }}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.pill,
  },
  raised: {
    boxShadow: shadows.raised,
  },
  label: {
    fontFamily: fonts.body,
  },
});
