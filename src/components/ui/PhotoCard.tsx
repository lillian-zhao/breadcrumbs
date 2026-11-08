import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Photo as PhotoData } from '@/data';
import { colors, fonts, radii } from '@/theme';

import { Photo } from './Photo';

type Size = { width: number; height: number; photoHeight: number };

type Props = {
  photo: PhotoData;
  title: string;
  subtitle: string;
  /**
   * `overlay` — the label floats over the bottom of a square photo (friend cards).
   * `stacked` — the label sits below the photo inside one tile (saved places).
   */
  variant?: 'overlay' | 'stacked';
  size?: Size;
  labelColor?: string;
  titleSize?: number;
  labelPadding?: number;
  onPress?: () => void;
};

const overlaySize: Size = { width: 165, height: 176, photoHeight: 165 };

export function PhotoCard({
  photo,
  title,
  subtitle,
  variant = 'overlay',
  size = overlaySize,
  labelColor = colors.crumb,
  titleSize,
  labelPadding,
  onPress,
}: Props) {
  const isOverlay = variant === 'overlay';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={[{ width: size.width, height: size.height }, !isOverlay && styles.stackedTile]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}, ${subtitle}`}
    >
      <Photo photo={photo} radius={isOverlay ? radii.card : 0} style={{ height: size.photoHeight }} />
      <View
        style={[
          isOverlay ? styles.overlayLabel : styles.stackedLabel,
          { backgroundColor: labelColor },
          labelPadding !== undefined && { paddingHorizontal: labelPadding },
        ]}
      >
        <Text
          style={[isOverlay ? styles.overlayTitle : styles.stackedTitle, titleSize !== undefined && { fontSize: titleSize }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text style={isOverlay ? styles.overlaySubtitle : styles.stackedSubtitle}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stackedTile: {
    borderRadius: radii.card,
    overflow: 'hidden',
  },
  overlayLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 116,
    height: 60,
    borderRadius: radii.card,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  overlayTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 25,
    color: colors.white,
  },
  overlaySubtitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    color: colors.white,
  },
  stackedLabel: {
    flex: 1,
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  stackedTitle: {
    fontFamily: fonts.display,
    fontSize: 14,
    color: colors.white,
  },
  stackedSubtitle: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.paper,
  },
});
