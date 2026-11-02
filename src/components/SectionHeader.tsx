import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  label: string;
  fontSize: number;
  rule: ImageSource;
  ruleWidth: number;
  ruleTop: number;
};

export function SectionHeader({ label, fontSize, rule, ruleWidth, ruleTop }: Props) {
  return (
    <View style={styles.row} accessibilityRole="header">
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
      <Image source={rule} style={[styles.rule, { width: ruleWidth, top: ruleTop }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    height: 37,
  },
  label: {
    fontFamily: fonts.body,
    color: colors.crumb,
    paddingLeft: 5,
  },
  rule: {
    position: 'absolute',
    right: 0,
    height: 1,
  },
});
