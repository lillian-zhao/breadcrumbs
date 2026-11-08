import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { toDayParam } from '@/components/calendar';
import { ProfileCalendar } from '@/components/ProfileCalendar';
import {
  ActionCard,
  Avatar,
  Divider,
  HeroTitle,
  IconButton,
  PhotoCard,
  Screen,
  SectionHeading,
} from '@/components/ui';
import { currentUser, getShadedDays, savedPlaces, today } from '@/data';
import { colors, fonts } from '@/theme';

const stats = [
  { value: currentUser.daysLogged, label: 'days logged' },
  { value: currentUser.followers, label: 'followers' },
  { value: currentUser.following, label: 'following' },
];

export default function Profile() {
  const [visibleMonth, setVisibleMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });

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
        <Avatar photo={currentUser.avatar} size={116} />
        <Text style={styles.name}>{currentUser.name}</Text>
        <View style={styles.stats}>
          {stats.flatMap((stat, index) => [
            index > 0 && <View key={`${stat.label}-divider`} style={styles.statDivider} />,
            <Pressable
              key={stat.label}
              style={styles.stat}
              accessibilityRole="button"
              onPress={
                stat.label === 'followers'
                  ? () => router.push('/people?tab=followers' as Href)
                  : stat.label === 'following'
                    ? () => router.push('/people?tab=following' as Href)
                    : undefined
              }
            >
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

      <ProfileCalendar
        personId={currentUser.id}
        year={visibleMonth.year}
        month={visibleMonth.month}
        today={today}
        shadedDays={getShadedDays(currentUser.id, visibleMonth.year, visibleMonth.month)}
        onShiftMonth={shiftMonth}
        onSelectDay={(date) => router.push(`/log-day?date=${toDayParam(date)}` as Href)}
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
            onPress={() => router.push(`/place/${place.id}` as Href)}
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
  calendarDivider: {
    marginTop: 14,
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
});
