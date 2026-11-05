import { Image, type ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, shadows } from '@/theme';

type Props = {
  label?: string;
  onPress?: () => void;
  icon?: ImageSource;
  iconSize?: number;
  iconStyle?: StyleProp<ImageStyle>;
  raised?: boolean;
  style?: StyleProp<ViewStyle>;
};

function goBack() {
  if (router.canGoBack()) router.back();
  else router.navigate('/');
}

export function BackButton({
  label = 'Back',
  onPress = goBack,
  icon = require('@assets/icons/arrow-left.svg'),
  iconSize = 18,
  iconStyle,
  raised = false,
  style,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, raised && styles.raised, style]}
      accessibilityRole="button"
      accessibilityLabel={label === 'Back' ? 'Back' : `Back to ${label}`}
      hitSlop={6}
    >
      <Image source={icon} style={[{ width: iconSize, height: iconSize }, iconStyle]} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    height: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.cream,
  },
  raised: {
    boxShadow: shadows.raised,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.bark,
  },
});
