import { Image, type ImageSource } from 'expo-image';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  title: string;
  subtitle?: string;
  icon?: ImageSource;
  iconTint?: string;
  /** Short text action on the right, like "Edit" or "Change". */
  actionLabel?: string;
  onAction?: () => void;
  /** Show a chevron and make the whole row navigable. */
  onPress?: () => void;
  /** Custom trailing content, such as a Toggle. */
  trailing?: ReactNode;
  /**
   * `compact` — icon row with a sand underline (logging screens).
   * `settings` — larger text, toast underline, 58px tall.
   */
  variant?: 'compact' | 'settings';
  style?: StyleProp<ViewStyle>;
};

/** The "Setting row": a titled line item with an optional icon and trailing control. */
export function ListRow({
  title,
  subtitle,
  icon,
  iconTint,
  actionLabel,
  onAction,
  onPress,
  trailing,
  variant = 'compact',
  style,
}: Props) {
  const isSettings = variant === 'settings';

  const body = (
    <>
      {icon && <Image source={icon} tintColor={iconTint} style={styles.icon} />}
      <View style={styles.text}>
        <Text style={isSettings ? styles.settingsTitle : styles.compactTitle}>{title}</Text>
        {subtitle !== undefined && (
          <Text style={isSettings ? styles.settingsSubtitle : styles.compactSubtitle}>{subtitle}</Text>
        )}
      </View>
      {actionLabel !== undefined && (
        <Pressable onPress={onAction} accessibilityRole="button" accessibilityLabel={`${actionLabel} ${title}`} hitSlop={10}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
      {trailing}
      {onPress && !trailing && <Image source={require('@assets/icons/chevron-row.svg')} style={styles.chevron} />}
    </>
  );

  const rowStyle = [styles.row, isSettings ? styles.settingsRow : styles.compactRow, style];

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={rowStyle} accessibilityRole="button">
        {body}
      </Pressable>
    );
  }
  return <View style={rowStyle}>{body}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  compactRow: {
    paddingBottom: 12,
    borderBottomColor: colors.sand,
  },
  settingsRow: {
    height: 58,
    borderBottomColor: colors.toast,
  },
  icon: {
    width: 20,
    height: 20,
  },
  text: {
    flex: 1,
  },
  compactTitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21.7,
    color: colors.ink,
  },
  compactSubtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18.6,
    color: colors.caption,
  },
  settingsTitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  settingsSubtitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    color: colors.bark,
  },
  action: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.bark,
  },
  chevron: {
    width: 20,
    height: 20,
  },
});
