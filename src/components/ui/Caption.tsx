import type { ReactNode } from 'react';
import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  children: ReactNode;
  align?: 'left' | 'center';
  style?: StyleProp<TextStyle>;
};

/** Helper / supporting copy used under forms, lists and cards. */
export function Caption({ children, align = 'left', style }: Props) {
  return <Text style={[styles.caption, { textAlign: align }, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.caption,
  },
});
