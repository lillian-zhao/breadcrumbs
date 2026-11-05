import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
};

export function Toggle({ value, onValueChange, accessibilityLabel }: Props) {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[styles.track, { backgroundColor: value ? colors.crumb : colors.toggleOff }]}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <View style={[styles.knob, { left: value ? 24 : 4 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
  },
  knob: {
    position: 'absolute',
    top: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
  },
});
