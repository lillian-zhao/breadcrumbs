import { Image } from 'expo-image';
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { Avatar, IconButton } from '@/components/ui';
import { getCrumbsForFriend, getPerson, mapPhotos, nearbyFriendPins, type Crumb, type Photo } from '@/data';
import { colors, fonts, mapColors, shadows } from '@/theme';

type Rect = [left: number, top: number, width: number, height: number];

const blocks: Rect[] = [
  [266, 502, 136, 82],
  [100, 502, 140, 82],
  [0, 502, 80, 82],
  [266, 328, 136, 157],
  [266, 147, 94, 160],
  [100, 147, 140, 160],
  [0, 147, 80, 160],
  [266, 0, 94, 129],
  [100, 0, 140, 129],
  [0, 0, 80, 129],
];

const streets: Rect[] = [
  [0, 485, 402, 17],
  [0, 307, 402, 21],
  [0, 129, 402, 18],
  [360, 0, 42, 584],
  [240, 0, 26, 584],
  [80, 0, 20, 584],
];

const diagonalStreets = [
  { centerX: 274.517, centerY: 291.03, width: 27.53 },
  { centerX: 151.664, centerY: 291.78, width: 21.63 },
];

const streetLabels = [
  { text: 'PITTSBURGH, PENNSYLVANIA', left: 25, top: 25, size: 10, color: mapColors.label },
  { text: '5TH AVE', left: 112, top: 133, size: 9, color: mapColors.label },
  { text: 'BAYARD ST', left: 12, top: 310, size: 9, color: mapColors.label },
  { text: 'FRICK PARK', left: 27, top: 458, size: 10, color: mapColors.parkLabel },
];

function rectStyle([left, top, width, height]: Rect): ViewStyle {
  return { position: 'absolute', left, top, width, height };
}

type PhotoPinProps = {
  photo: Photo;
  left: number;
  top: number;
  label: string;
  onPress?: () => void;
};

function PhotoPin({ photo, left, top, label, onPress }: PhotoPinProps) {
  return (
    <Pressable
      style={[styles.pin, { left, top, width: 48 }]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : 'image'}
      accessibilityLabel={label}
    >
      <Avatar photo={photo} size={48} ringColor={colors.plum} raised />
      <Image source={require('@assets/shapes/pin-tail.svg')} style={styles.pinTail} />
    </Pressable>
  );
}

type PlaceLabelProps = {
  title: string;
  detail: string;
  left: number;
  top: number;
  titleSize: number;
  paddingHorizontal: number;
  paddingVertical: number;
};

function PlaceLabel({ title, detail, left, top, titleSize, paddingHorizontal, paddingVertical }: PlaceLabelProps) {
  return (
    <View style={[styles.placeLabel, { left, top, paddingHorizontal, paddingVertical }]}>
      <Text style={[styles.placeTitle, { fontSize: titleSize }]}>{title}</Text>
      <Text style={styles.placeDetail}>{detail}</Text>
    </View>
  );
}

type Variant = 'mine' | 'friends' | 'friend';

type Props = {
  variant?: Variant;
  friendId?: string;
  onSelectPin?: (id: string) => void;
};

export function DayMap({ variant = 'mine', friendId, onSelectPin }: Props) {
  const friendCrumbs = friendId ? getCrumbsForFriend(friendId) : [];
  const friendPins = [
    { crumb: friendCrumbs[0], left: 230, top: 266, labelLeft: 251, labelTop: 218 },
    { crumb: friendCrumbs[1], left: 66, top: 68, labelLeft: 122, labelTop: 70 },
  ].filter((pin): pin is { crumb: Crumb; left: number; top: number; labelLeft: number; labelTop: number } =>
    pin.crumb !== undefined,
  );

  return (
    <View style={styles.map}>
      {blocks.map((block, index) => (
        <View key={`block-${index}`} style={[rectStyle(block), styles.block]} />
      ))}
      {streets.map((street, index) => (
        <View key={`street-${index}`} style={[rectStyle(street), styles.street]} />
      ))}
      {diagonalStreets.map(({ centerX, centerY, width }, index) => (
        <View
          key={`diagonal-${index}`}
          style={[
            styles.street,
            styles.diagonalStreet,
            { width, left: centerX - width / 2, top: centerY - 320 },
          ]}
        />
      ))}
      <View style={[rectStyle([0, 328, 238, 157]), styles.park]} />
      <Image source={require('@assets/shapes/park-path.svg')} style={styles.parkPath} />

      {streetLabels.map((label) => (
        <Text
          key={label.text}
          style={[styles.streetLabel, { left: label.left, top: label.top, fontSize: label.size, color: label.color }]}
        >
          {label.text}
        </Text>
      ))}
      <Text style={[styles.streetLabel, styles.forbesAve]}>FORBES AVE</Text>

      <IconButton
        icon={require('@assets/icons/locate-fixed.svg')}
        iconSize={18}
        variant="raised"
        accessibilityLabel="Center on my location"
        style={styles.locateButton}
      />

      {variant !== 'friend' && (
        <>
          <View style={styles.currentLocation}>
            <Image source={require('@assets/shapes/live-indicator.svg')} style={styles.liveIndicator} />
            <Text style={styles.currentLocationText}>Home · now</Text>
          </View>

          <View style={[styles.pin, { left: 289, top: 386, width: 46 }]} accessibilityLabel="Home">
            <View style={styles.homeMarker}>
              <Image source={require('@assets/icons/house.svg')} style={styles.icon22} />
            </View>
            <Image source={require('@assets/shapes/home-pin-tail.svg')} style={styles.pinTail} />
          </View>
        </>
      )}

      {variant === 'mine' && (
        <>
          <PlaceLabel
            title="Cafe"
            detail="10:30 am · 1 photo"
            left={251}
            top={218}
            titleSize={16}
            paddingHorizontal={12}
            paddingVertical={8}
          />
          <PhotoPin
            photo={mapPhotos.cafe}
            left={230}
            top={266}
            label="Cafe"
            onPress={() => onSelectPin?.('cafe')}
          />

          <PlaceLabel
            title="Morning walk"
            detail="9:15 am · Lillian"
            left={122}
            top={70}
            titleSize={15}
            paddingHorizontal={10}
            paddingVertical={7}
          />
          <PhotoPin
            photo={mapPhotos.morningWalk}
            left={66}
            top={68}
            label="Morning walk"
            onPress={() => onSelectPin?.('walk')}
          />
        </>
      )}

      {variant === 'friends' &&
        nearbyFriendPins.map((pin) => {
          const person = getPerson(pin.friendId);
          if (!person) return null;
          return (
            <Fragment key={pin.friendId}>
              <PlaceLabel
                title={person.name}
                detail={`${pin.place} · ${pin.detail}`}
                left={pin.labelLeft}
                top={pin.labelTop}
                titleSize={15}
                paddingHorizontal={10}
                paddingVertical={7}
              />
              <PhotoPin
                photo={person.avatar}
                left={pin.left}
                top={pin.top}
                label={`${person.name} at ${pin.place}`}
                onPress={() => onSelectPin?.(pin.friendId)}
              />
            </Fragment>
          );
        })}

      {variant === 'friend' &&
        friendPins.map(({ crumb, left, top, labelLeft, labelTop }) => (
          <Fragment key={crumb.id}>
            <PlaceLabel
              title={crumb.place}
              detail={`${crumb.time} · ${crumb.city}`}
              left={labelLeft}
              top={labelTop}
              titleSize={15}
              paddingHorizontal={10}
              paddingVertical={7}
            />
            <PhotoPin
              photo={crumb.photo}
              left={left}
              top={top}
              label={crumb.place}
              onPress={() => onSelectPin?.(crumb.id)}
            />
          </Fragment>
        ))}

      <Image source={require('@assets/shapes/daily-trail.png')} style={styles.trail} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: 402,
    height: 581,
    alignSelf: 'center',
    backgroundColor: mapColors.ground,
    overflow: 'hidden',
  },
  block: {
    backgroundColor: mapColors.block,
    borderRadius: 4,
  },
  street: {
    backgroundColor: mapColors.street,
  },
  diagonalStreet: {
    position: 'absolute',
    height: 640,
    transform: [{ rotate: '-14.7deg' }],
  },
  park: {
    backgroundColor: mapColors.park,
    borderRadius: 6,
  },
  parkPath: {
    position: 'absolute',
    left: -10.55,
    top: 339.17,
    width: 206.805,
    height: 132.22,
  },
  streetLabel: {
    position: 'absolute',
    fontFamily: fonts.body,
  },
  forbesAve: {
    left: 344,
    top: 231,
    width: 55,
    fontSize: 9,
    color: mapColors.label,
    textAlign: 'center',
    transform: [{ rotate: '-90deg' }],
  },
  locateButton: {
    position: 'absolute',
    left: 24,
    top: 514,
  },
  icon22: {
    width: 22,
    height: 22,
  },
  currentLocation: {
    position: 'absolute',
    left: 256,
    top: 450,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  liveIndicator: {
    width: 6,
    height: 6,
  },
  currentLocationText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ink,
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
  },
  homeMarker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 3,
    borderColor: colors.plum,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: shadows.raised,
  },
  pinTail: {
    width: 10,
    height: 12,
  },
  placeLabel: {
    position: 'absolute',
    gap: 3,
    borderRadius: 8,
    backgroundColor: colors.cream,
    boxShadow: shadows.raised,
  },
  placeTitle: {
    fontFamily: fonts.display,
    color: colors.ink,
  },
  placeDetail: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: mapColors.label,
  },
  trail: {
    position: 'absolute',
    left: 88,
    top: 116,
    width: 226,
    height: 322,
  },
});
