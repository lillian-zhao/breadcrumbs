import { Image } from 'expo-image';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { Photo as PhotoData } from '@/data';
import { colors, radii } from '@/theme';

type Props = {
  photo: PhotoData;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

export function Photo({ photo, radius = radii.card, style }: Props) {
  const { source, crop } = photo;

  return (
    <View style={[styles.frame, { borderRadius: radius }, style]}>
      {crop ? (
        <Image
          source={source}
          style={[
            styles.cropped,
            { height: crop.height, top: crop.top, width: crop.width ?? '100%', left: crop.left ?? 0 },
          ]}
        />
      ) : (
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    backgroundColor: colors.track,
  },
  cropped: {
    position: 'absolute',
  },
});
