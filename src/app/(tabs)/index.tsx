import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { HeroTitle, Photo, PhotoCard, Screen, SectionHeading } from '@/components/ui';
import { friendWeeks, getFriend, weeklyWrapped } from '@/data';
import { colors, fonts, radii } from '@/theme';

const wrappedPositions = [
  { top: 0, left: 0, zIndex: 1 },
  { top: 0, left: 168, zIndex: 1 },
  { top: 150, left: 0 },
  { top: 150, left: 168 },
];

export default function Home() {
  return (
    <Screen contentWidth={336}>
      <HeroTitle title="Home" height={84} ornamentsLeft={247} />

      <SectionHeading label="yours" fontSize={20} gap={7} labelInset={5} style={styles.sectionRow} />

      <Pressable style={styles.noteButton} onPress={() => router.push('/log-day')} accessibilityRole="button">
        <Image source={require('@assets/icons/bread.png')} style={styles.noteIcon} />
        <Text style={styles.noteText}>note today’s crumb!</Text>
      </Pressable>

      <Pressable style={styles.wrapped} accessibilityRole="button" accessibilityLabel="your weekly wrapped">
        {weeklyWrapped.map((photo, index) => (
          <Photo key={index} photo={photo} style={[styles.wrappedTile, wrappedPositions[index]]} />
        ))}
        <Image source={require('@assets/shapes/wrapped-overlay.svg')} style={styles.wrappedOverlay} />
        <Text style={styles.wrappedText}>your weekly wrapped.</Text>
      </Pressable>

      <SectionHeading label="friends" gap={9} labelInset={5} style={[styles.sectionRow, styles.friendsHeading]} />

      <View style={styles.friendsGrid}>
        {friendWeeks.map((week) => (
          <PhotoCard
            key={week.friendId}
            photo={week.cover}
            title={getFriend(week.friendId).name}
            subtitle={`${week.places} places, ${week.newPlaces} new`}
            onPress={() => router.push(`/friend/${week.friendId}` as Href)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    height: 37,
  },
  noteButton: {
    marginTop: 4,
    height: 81,
    borderRadius: radii.button,
    backgroundColor: colors.toast,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 21,
    gap: 16,
  },
  noteIcon: {
    width: 32,
    height: 32,
  },
  noteText: {
    fontFamily: fonts.body,
    fontSize: 24,
    color: colors.white,
  },
  wrapped: {
    marginTop: 19,
    height: 304,
  },
  wrappedTile: {
    position: 'absolute',
    width: 168,
    height: 154,
  },
  wrappedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 336,
    height: 304,
  },
  wrappedText: {
    position: 'absolute',
    left: 21,
    top: 188,
    width: 311,
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    color: colors.white,
  },
  friendsHeading: {
    marginTop: 13,
  },
  friendsGrid: {
    marginTop: 4,
    marginHorizontal: -2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 8,
    rowGap: 14,
  },
});
