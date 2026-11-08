import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { toDayParam } from '@/components/calendar';
import { ProfileCalendar } from '@/components/ProfileCalendar';
import {
  ActionCard,
  Avatar,
  BackButton,
  Caption,
  Card,
  Divider,
  HeroTitle,
  PhotoCard,
  Pill,
  Screen,
  SectionHeading,
} from '@/components/ui';
import type { FriendshipState } from '@/api';
import {
  acceptFriend,
  countLoggedDays,
  getShadedDays,
  getSharedPlaces,
  requestFriend,
  today,
  unfriend,
  useFriendProfile,
} from '@/data';
import { colors, fonts } from '@/theme';

/** The follow pill for each relationship; null hides it. */
function followAction(status: FriendshipState | undefined, friendId: string) {
  if (!status) return null;
  switch (status.kind) {
    case 'accepted':
      return { label: 'Following', selected: true, run: () => unfriend(friendId) };
    case 'pending':
      return status.direction === 'incoming'
        ? { label: 'Accept', selected: false, run: () => acceptFriend(friendId) }
        : { label: 'Requested', selected: true, run: undefined };
    case 'none':
      return { label: 'Follow', selected: false, run: () => requestFriend(friendId) };
    default:
      return null;
  }
}

export default function FriendProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const friendId = (Array.isArray(id) ? id[0] : id) ?? '';
  const { data, loading, reload } = useFriendProfile(friendId);
  const [visibleMonth, setVisibleMonth] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [saving, setSaving] = useState(false);

  const friend = data?.friend;
  const status = data?.status;
  const isFriend = status?.kind === 'accepted';
  const follow = followAction(status, friendId);
  const runFollow = follow?.run;

  if (!friend) {
    return (
      <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
        <BackButton label="Friends" />
        <Caption>{loading ? 'Loading…' : 'That person isn’t in your circle yet.'}</Caption>
      </Screen>
    );
  }

  const places = getSharedPlaces(friend.id);
  const daysShared = countLoggedDays(friend.id, visibleMonth.year);
  const stats = [
    { value: daysShared, label: 'days shared' },
    { value: places.length, label: 'saved spots' },
  ];

  const shiftMonth = (delta: number) =>
    setVisibleMonth(({ year, month }) => {
      const next = new Date(year, month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  return (
    <Screen topOffset={20} contentWidth={354} withTabBar={false}>
      <BackButton label="Friends" style={styles.back} />
      <HeroTitle title="Profile" height={96} ornamentsLeft={277} style={styles.inset} />

      <View style={styles.profileHeader}>
        <Avatar photo={friend.avatar} size={116} />
        <Text style={styles.name}>{friend.name}</Text>
        {follow && (
          <Pill
            label={follow.label}
            icon={follow.selected ? require('@assets/icons/check.svg') : undefined}
            tintIcons
            tone={follow.selected ? 'selected' : 'default'}
            onPress={
              runFollow && !saving
                ? () => {
                    setSaving(true);
                    runFollow()
                      .catch(console.warn)
                      .finally(() => {
                        setSaving(false);
                        reload();
                      });
                  }
                : undefined
            }
          />
        )}
        {isFriend && (
          <View style={styles.stats}>
            {stats.flatMap((stat, index) => [
              index > 0 && <View key={stat.label + '-divider'} style={styles.statDivider} />,
              <View key={stat.label} style={styles.stat}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>,
            ])}
          </View>
        )}
      </View>

      {!isFriend && (
        <Card style={styles.inset}>
          {!!friend.bio && <Text style={styles.bio}>{friend.bio}</Text>}
          <Caption>Follow {friend.name} to see the crumbs they share with friends.</Caption>
        </Card>
      )}

      {isFriend && (
        <>
          <View style={styles.actionCards}>
            <ActionCard
              icon={require('@assets/icons/map-pin-card.svg')}
              title="Saved spots"
              subtitle={'Places ' + friend.name + ' shares'}
              color={colors.bark}
              href={'/friend-places/' + friend.id as Href}
            />
            <ActionCard
              icon={require('@assets/icons/plus-circle.svg')}
              title="Their week"
              subtitle="A shared recap"
              color={colors.crumb}
              href={'/wrapped?friend=' + friend.id as Href}
            />
          </View>

          <ProfileCalendar
            personId={friend.id}
            year={visibleMonth.year}
            month={visibleMonth.month}
            today={today}
            shadedDays={getShadedDays(friend.id, visibleMonth.year, visibleMonth.month)}
            onShiftMonth={shiftMonth}
            onSelectDay={(date) => router.push('/journal/' + friend.id + '?date=' + toDayParam(date) as Href)}
          />

          <Divider tone="toast" style={styles.calendarDivider} />

          <SectionHeading label="saved locations" gap={9} labelInset={5} style={[styles.inset, styles.sectionHeading]} />
          <View style={styles.tileRow}>
            {places.map((place) => (
              <PhotoCard
                key={place.id}
                variant="stacked"
                photo={place.photo}
                title={place.name}
                subtitle={place.category + ' • ' + place.price}
                size={{ width: 110, height: 130, photoHeight: 80 }}
                labelColor={colors.bark}
                titleSize={13}
                labelPadding={8}
                onPress={() => router.push('/place/' + place.id as Href)}
              />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    marginLeft: 10,
  },
  inset: {
    marginHorizontal: 10,
  },
  profileHeader: {
    minHeight: 225,
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.ink,
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
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
