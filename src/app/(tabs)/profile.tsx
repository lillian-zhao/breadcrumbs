import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { MonthCalendar } from '@/components/MonthCalendar';
import {
  ActionCard,
  Avatar,
  Divider,
  HeroTitle,
  IconButton,
  PhotoCard,
  Screen,
  SectionHeading,
  SegmentedControl,
} from '@/components/ui';
import { emptyPhoto, useAlbums, useCurrentUser, useLoggedDays, useSavedPlaces } from '@/data';
import { colors, fonts, radii } from '@/theme';

type CalendarScale = 'month' | 'year';

export default function Profile() {
  const [today] = useState(() => new Date());
  const [visibleMonth, setVisibleMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [scale, setScale] = useState<CalendarScale>('month');
  const { data: currentUser } = useCurrentUser();
  const { data: loggedDays = [] } = useLoggedDays(visibleMonth.year, visibleMonth.month);
  const { data: savedPlaces = [] } = useSavedPlaces();
  const { data: albums = [] } = useAlbums();

  const stats = [
    { value: currentUser?.daysLogged ?? '–', label: 'days logged' },
    { value: currentUser?.followers ?? '–', label: 'followers' },
    { value: currentUser?.following ?? '–', label: 'following' },
  ];

  const shiftMonth = (delta: number) =>
    setVisibleMonth(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  return (
    <Screen topOffset={20} contentWidth={354}>
      <HeroTitle title="Profile" height={96} ornamentsLeft={277} style={styles.inset}>
        <IconButton
          icon={require('@assets/icons/settings-gear.svg')}
          iconSize={24}
          variant="bare"
          accessibilityLabel="Settings"
          onPress={() => router.push('/settings')}
          style={styles.settings}
        />
      </HeroTitle>

      <View style={styles.profileHeader}>
        <Avatar photo={currentUser?.avatar ?? emptyPhoto} size={116} />
        <Text style={styles.name}>{currentUser?.name}</Text>
        <View style={styles.stats}>
          {stats.flatMap((stat, index) => [
            index > 0 && <View key={`${stat.label}-divider`} style={styles.statDivider} />,
            <Pressable key={stat.label} style={styles.stat} accessibilityRole="button">
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Pressable>,
          ])}
        </View>
      </View>

      <View style={styles.actionCards}>
        <ActionCard
          icon={require('@assets/icons/map-pin-card.svg')}
          title="My Crumbs"
          subtitle="All your saved spots"
          color={colors.bark}
          href="/saved-spots"
        />
        <ActionCard
          icon={require('@assets/icons/plus-circle.svg')}
          title="Log a Day"
          subtitle="Record today's places"
          color={colors.crumb}
          href="/log-day"
        />
      </View>

      <Text style={styles.calendarTitle}>Calendar</Text>

      <View style={styles.calendarNav}>
        <IconButton
          icon={require('@assets/icons/chevron-left.svg')}
          accessibilityLabel="Previous month"
          onPress={() => shiftMonth(-1)}
        />
        <SegmentedControl
          variant="boxed"
          segments={[
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          value={scale}
          onChange={setScale}
        />
        <IconButton
          icon={require('@assets/icons/chevron-right.svg')}
          accessibilityLabel="Next month"
          onPress={() => shiftMonth(1)}
        />
      </View>

      <MonthCalendar
        year={visibleMonth.year}
        month={visibleMonth.month}
        today={today}
        shadedDays={loggedDays}
      />

      <Divider tone="toast" style={styles.calendarDivider} />

      <SectionHeading label="saved locations" gap={9} labelInset={5} style={[styles.inset, styles.sectionHeading]} />
      <View style={styles.tileRow}>
        {savedPlaces.map((place) => (
          <PhotoCard
            key={place.id}
            variant="stacked"
            photo={place.photo}
            title={place.name}
            subtitle={`${place.category} • ${place.price}`}
            size={{ width: 110, height: 130, photoHeight: 80 }}
            labelColor={colors.bark}
            titleSize={13}
            labelPadding={8}
            onPress={() => router.push('/saved-spots')}
          />
        ))}
      </View>

      <Divider tone="toast" style={styles.albumsDivider} />

      <SectionHeading label="photo albums" gap={9} labelInset={5} style={[styles.inset, styles.sectionHeading]} />
      <Pressable style={styles.viewAll} onPress={() => router.navigate('/gallery')} accessibilityRole="button">
        <Text style={styles.viewAllText}>View all</Text>
        <Image source={require('@assets/icons/chevron-view-all.svg')} style={styles.viewAllChevron} />
      </Pressable>
      <View style={[styles.tileRow, styles.albums]}>
        {albums.map((album) => (
          <PhotoCard
            key={album.id}
            variant="stacked"
            photo={album.cover}
            title={album.title}
            subtitle={`${album.photoCount} photos`}
            size={{ width: 170, height: 153, photoHeight: 100 }}
            onPress={() => router.navigate('/gallery')}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  inset: {
    marginHorizontal: 10,
  },
  settings: {
    position: 'absolute',
    left: 218,
    top: 22,
  },
  profileHeader: {
    height: 225,
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.toast,
  },
  stat: {
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    color: colors.ink,
  },
  statLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.bark,
  },
  actionCards: {
    flexDirection: 'row',
    gap: 14,
  },
  calendarTitle: {
    marginTop: 30,
    height: 30,
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.bark,
    textAlign: 'center',
  },
  calendarNav: {
    marginTop: 8,
    marginBottom: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarDivider: {
    marginTop: 14,
  },
  albumsDivider: {
    marginTop: 18,
  },
  sectionHeading: {
    height: 37,
    marginTop: 15,
    marginBottom: 11,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 12,
  },
  viewAll: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radii.control,
    backgroundColor: colors.cream,
  },
  viewAllText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.bark,
  },
  viewAllChevron: {
    width: 8.173,
    height: 13.8,
    marginRight: -1.27,
  },
  albums: {
    marginTop: 10,
    gap: 14,
  },
});
