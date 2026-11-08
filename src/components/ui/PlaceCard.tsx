import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Photo as PhotoData } from '@/data';
import { colors, fonts } from '@/theme';

import { Photo } from './Photo';

type Props = {
  photo: PhotoData;
  title: string;
  subtitle: string;
  caption: string;
  bookmarked?: boolean;
  onPress?: () => void;
  onBookmark?: () => void;
};

/** Full-width cream place tile used by Saved spots and place collections. */
export function PlaceCard({ photo, title, subtitle, caption, bookmarked = true, onPress, onBookmark }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        style={styles.body}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={`${title}, ${subtitle}`}
      >
        <Photo photo={photo} style={styles.photo} />
        <View style={styles.info}>
          <View style={styles.identity}>
            <View style={styles.names}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
            {onBookmark ? <View style={styles.bookmarkSpacer} /> : null}
          </View>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </Pressable>
      {onBookmark ? (
        <Pressable
          onPress={onBookmark}
          hitSlop={8}
          style={styles.bookmarkButton}
          accessibilityRole="button"
          accessibilityLabel={bookmarked ? `Remove ${title}` : `Save ${title}`}
        >
          <Image source={require('@assets/icons/bookmark.svg')} style={styles.bookmark} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 14,
    backgroundColor: colors.cream,
  },
  body: {
    overflow: 'hidden',
  },
  photo: {
    height: 152,
  },
  info: {
    gap: 7,
    padding: 14,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  names: {
    flex: 1,
    gap: 5,
  },
  bookmarkSpacer: {
    width: 20,
    height: 20,
  },
  bookmarkButton: {
    position: 'absolute',
    right: 14,
    top: 166,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.caption,
  },
  bookmark: {
    width: 20,
    height: 20,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.bark,
  },
});
