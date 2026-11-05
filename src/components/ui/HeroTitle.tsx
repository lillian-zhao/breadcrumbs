import { Image } from 'expo-image';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  title: string;
  height: number;
  /** x position of the crumb cluster relative to the title's left edge. */
  ornamentsLeft: number;
  style?: StyleProp<ViewStyle>;
  /** Extra absolutely positioned content, such as the Profile settings button. */
  children?: ReactNode;
};

/** The 64px title used by the tab screens, with crumbs floating at the baseline. */
export function HeroTitle({ title, height, ornamentsLeft, style, children }: Props) {
  return (
    <View style={[{ height }, style]}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <Image source={require('@assets/shapes/crumb-star.svg')} style={[styles.star, { left: ornamentsLeft }]} />
      <View style={[styles.smallStarFrame, { left: ornamentsLeft + 20.99 }]}>
        <Image source={require('@assets/shapes/crumb-small-star.svg')} style={styles.smallStar} />
      </View>
      <Image
        source={require('@assets/shapes/crumb-triangle.svg')}
        style={[styles.triangle, { left: ornamentsLeft + 43.8 }]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 90,
    color: colors.crumb,
  },
  star: {
    position: 'absolute',
    top: 49,
    width: 19,
    height: 17,
  },
  smallStarFrame: {
    position: 'absolute',
    top: 49,
    width: 17.601,
    height: 17.467,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallStar: {
    width: 13.118,
    height: 11.737,
    transform: [{ rotate: '41.08deg' }],
  },
  triangle: {
    position: 'absolute',
    top: 53,
    width: 10.392,
    height: 9,
  },
});
