import { Image } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

const ornamentAssets = {
  page: { source: require('@assets/shapes/crumb-ornaments-page.svg'), width: 57, height: 17 },
  map: { source: require('@assets/shapes/crumb-ornaments-map.svg'), width: 64.104, height: 17.471 },
  friends: { source: require('@assets/shapes/crumb-ornaments-friends.svg'), width: 62.104, height: 17.471 },
};

type Props = {
  title: string;
  fontSize: number;
  lineHeight: number;
  ornaments?: keyof typeof ornamentAssets;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** A page title with the crumb ornaments pushed to the trailing edge. */
export function TitleRow({ title, fontSize, lineHeight, ornaments = 'page', height, style }: Props) {
  const ornament = ornamentAssets[ornaments];

  return (
    <View style={[styles.row, height !== undefined && { height }, style]}>
      <Text style={[styles.title, { fontSize, lineHeight }]} accessibilityRole="header">
        {title}
      </Text>
      <Image source={ornament.source} style={{ width: ornament.width, height: ornament.height }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flexShrink: 1,
    fontFamily: fonts.display,
    color: colors.crumb,
  },
});
