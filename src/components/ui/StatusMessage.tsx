import { Image, type ImageSource } from 'expo-image';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii } from '@/theme';

type Props = {
  icon: ImageSource;
  title: string;
  body: string;
  style?: StyleProp<ViewStyle>;
};

/** The tinted “Looking good” / “You’re in control” callout used on account screens. */
export function StatusMessage({ icon, title, body, style }: Props) {
  return (
    <View style={[styles.message, style]}>
      <Image source={icon} style={styles.icon} />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: radii.control,
    backgroundColor: colors.track,
  },
  icon: {
    width: 18,
    height: 18,
  },
  text: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.ink,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.caption,
  },
});
