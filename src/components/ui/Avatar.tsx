import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Photo as PhotoData } from '@/data';
import { shadows } from '@/theme';

import { Photo } from './Photo';

type Props = {
  photo: PhotoData;
  /** Outer diameter, including the ring. */
  size: number;
  ringColor?: string;
  ringWidth?: number;
  raised?: boolean;
  /** Absolutely positioned overlay, such as an edit badge. */
  badge?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({ photo, size, ringColor, ringWidth = 3, raised = false, badge, style }: Props) {
  const inset = ringColor ? ringWidth : 0;
  const photoSize = size - inset * 2;

  return (
    <View
      style={[
        { width: size, height: size, borderRadius: size / 2, padding: inset, backgroundColor: ringColor },
        raised && styles.raised,
        style,
      ]}
    >
      <Photo photo={photo} radius={photoSize / 2} style={{ width: photoSize, height: photoSize }} />
      {badge}
    </View>
  );
}

const styles = StyleSheet.create({
  raised: {
    boxShadow: shadows.raised,
  },
});
