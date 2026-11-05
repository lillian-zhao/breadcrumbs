import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  label: string;
  fontSize?: number;
  ruleOpacity?: number;
  /** Space between the label and the rule. */
  gap?: number;
  labelInset?: number;
  style?: StyleProp<ViewStyle>;
};

/** Lowercase orange label followed by a hairline that runs to the edge. */
export function SectionHeading({ label, fontSize = 24, ruleOpacity = 1, gap = 12, labelInset = 0, style }: Props) {
  return (
    <View style={[styles.row, { gap }, style]} accessibilityRole="header">
      <Text style={[styles.label, { fontSize, lineHeight: Math.round(fontSize * 1.3), paddingLeft: labelInset }]}>
        {label}
      </Text>
      <View style={[styles.rule, { opacity: ruleOpacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.body,
    color: colors.crumb,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.crumb,
  },
});
