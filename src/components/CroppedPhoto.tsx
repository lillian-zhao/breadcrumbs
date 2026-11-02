import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';

export type Crop = {
  height: DimensionValue;
  top: DimensionValue;
};

type Props = {
  source: ImageSource;
  crop?: Crop;
  style?: StyleProp<ViewStyle>;
};

export function CroppedPhoto({ source, crop, style }: Props) {
  return (
    <View style={[styles.frame, style]}>
      {crop ? (
        <Image source={source} style={[styles.cropped, { height: crop.height, top: crop.top }]} />
      ) : (
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
  cropped: {
    position: 'absolute',
    left: 0,
    width: '100%',
  },
});
