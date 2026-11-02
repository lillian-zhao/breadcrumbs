import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CroppedPhoto } from '@/components/CroppedPhoto';
import { FriendCard, type Friend } from '@/components/FriendCard';
import { SectionHeader } from '@/components/SectionHeader';
import { TabBar } from '@/components/TabBar';
import { colors, fonts, radii } from '@/theme';

const wrappedTiles = [
  { photo: require('@assets/home/wrapped-1.png'), style: { top: 150, left: 0 } },
  { photo: require('@assets/home/wrapped-2.png'), style: { top: 150, left: 168 } },
  { photo: require('@assets/home/wrapped-3.png'), style: { top: 0, left: 0 } },
  {
    photo: require('@assets/home/wrapped-4.png'),
    style: { top: 0, left: 168 },
    crop: { height: '145.45%', top: '-45.4%' },
  },
] as const;

const friends: Friend[] = [
  {
    name: 'Annie',
    places: 12,
    newPlaces: 3,
    photo: require('@assets/home/friend-annie.png'),
    crop: { height: '133.33%', top: '-28.51%' },
  },
  {
    name: 'Alicia',
    places: 7,
    newPlaces: 1,
    photo: require('@assets/home/friend-alicia.png'),
    crop: { height: '133.33%', top: '-38.19%' },
  },
  { name: 'Tongtong', places: 2, newPlaces: 0, photo: require('@assets/home/friend-tongtong.png') },
  { name: 'Maggie', places: 8, newPlaces: 1, photo: require('@assets/home/friend-maggie.png') },
];

export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: Math.max(insets.top, 62) }]}>
        <View style={styles.title}>
          <Text style={styles.titleText} accessibilityRole="header">
            Home
          </Text>
          <Image source={require('@assets/home/crumb-1.svg')} style={styles.crumbStar} />
          <View style={styles.crumbSmallStarFrame}>
            <Image source={require('@assets/home/crumb-2.svg')} style={styles.crumbSmallStar} />
          </View>
          <Image source={require('@assets/home/crumb-4.svg')} style={styles.crumbTriangle} />
        </View>

        <SectionHeader
          label="yours"
          fontSize={20}
          rule={require('@assets/home/rule-yours.svg')}
          ruleWidth={274}
          ruleTop={16}
        />

        <Pressable style={styles.noteButton} accessibilityRole="button">
          <Image source={require('@assets/home/bread.png')} style={styles.noteIcon} />
          <Text style={styles.noteText}>note today’s crumb!</Text>
        </Pressable>

        <Pressable style={styles.wrapped} accessibilityRole="button" accessibilityLabel="your weekly wrapped">
          {wrappedTiles.map((tile, index) => (
            <CroppedPhoto
              key={index}
              source={tile.photo}
              crop={'crop' in tile ? tile.crop : undefined}
              style={[styles.wrappedTile, tile.style]}
            />
          ))}
          <Image source={require('@assets/home/wrapped-overlay.svg')} style={styles.wrappedOverlay} />
          <Text style={styles.wrappedText}>your weekly wrapped.</Text>
        </Pressable>

        <View style={styles.friendsHeader}>
          <SectionHeader
            label="friends"
            fontSize={24}
            rule={require('@assets/home/rule-friends.svg')}
            ruleWidth={245}
            ruleTop={18}
          />
        </View>

        <View style={styles.friendsGrid}>
          {friends.map((friend) => (
            <FriendCard key={friend.name} friend={friend} />
          ))}
        </View>
      </ScrollView>

      <TabBar active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    width: 336,
    alignSelf: 'center',
    paddingBottom: 122,
  },
  title: {
    height: 84,
  },
  titleText: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 90,
    color: colors.crumb,
  },
  crumbStar: {
    position: 'absolute',
    left: 247,
    top: 49,
    width: 19,
    height: 17,
  },
  crumbSmallStarFrame: {
    position: 'absolute',
    left: 267.99,
    top: 49,
    width: 17.601,
    height: 17.467,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crumbSmallStar: {
    width: 13.118,
    height: 11.737,
    transform: [{ rotate: '41.08deg' }],
  },
  crumbTriangle: {
    position: 'absolute',
    left: 290.8,
    top: 53,
    width: 10.392,
    height: 9,
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
    borderRadius: radii.card,
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
  friendsHeader: {
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
