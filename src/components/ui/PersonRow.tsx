import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Photo as PhotoData } from '@/data';
import { colors, fonts } from '@/theme';

import { Avatar } from './Avatar';
import { Pill } from './Pill';

type Props = {
  name: string;
  subtitle: string;
  photo: PhotoData;
  actionLabel: string;
  actionSelected?: boolean;
  onAction?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** Avatar, name, supporting line and a follow pill — used on People / search lists. */
export function PersonRow({
  name,
  subtitle,
  photo,
  actionLabel,
  actionSelected = false,
  onAction,
  onPress,
  style,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={styles.person}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={name}
      >
        <Avatar photo={photo} size={52} />
        <View style={styles.identity}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </Pressable>
      <Pill
        label={actionLabel}
        tone={actionSelected ? 'default' : 'selected'}
        onPress={onAction}
        accessibilityLabel={`${actionLabel} ${name}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  person: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  identity: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22.42,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.caption,
  },
});
