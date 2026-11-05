import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

import { BackButton } from './BackButton';
import { TitleRow } from './TitleRow';

type Props = {
  back: ComponentProps<typeof BackButton>;
  title: ComponentProps<typeof TitleRow>;
  subtitle?: string;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

/** Back control, title with crumbs and a supporting line — the header used by every detail screen. */
export function PageHeader({ back, title, subtitle, gap = 20, style, children }: Props) {
  return (
    <View style={[{ gap }, style]}>
      <BackButton {...back} />
      <TitleRow {...title} />
      {subtitle !== undefined && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18.85,
    color: colors.bark,
  },
});
