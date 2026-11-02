import type { ImageSource } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CroppedPhoto, type Crop } from '@/components/CroppedPhoto';
import { colors, fonts, radii } from '@/theme';

export type Friend = {
  name: string;
  places: number;
  newPlaces: number;
  photo: ImageSource;
  crop?: Crop;
};

type Props = {
  friend: Friend;
  onPress?: () => void;
};

export function FriendCard({ friend, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${friend.name}, ${friend.places} places, ${friend.newPlaces} new`}
    >
      <CroppedPhoto source={friend.photo} crop={friend.crop} style={styles.photo} />
      <View style={styles.label}>
        <Text style={styles.name} numberOfLines={1}>
          {friend.name}
        </Text>
        <Text style={styles.meta}>
          {friend.places} places, {friend.newPlaces} new
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 165,
    height: 176,
  },
  photo: {
    height: 165,
    borderRadius: radii.card,
  },
  label: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 116,
    height: 60,
    borderRadius: radii.card,
    backgroundColor: colors.crumb,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 25,
    color: colors.white,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 14,
    color: colors.white,
  },
});
