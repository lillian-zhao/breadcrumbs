import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radii } from '@/theme';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** The cream "Paper card" surface. */
export function Card({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 16,
    borderRadius: radii.button,
    backgroundColor: colors.cream,
  },
});
