import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { formatLoggedDay, parseDayParam } from '@/components/calendar';
import { NoLogDay } from '@/components/NoLogDay';
import {
  Avatar,
  Button,
  Caption,
  Card,
  ListRow,
  PageHeader,
  Photo,
  Pill,
  Screen,
  SectionHeading,
} from '@/components/ui';
import { getPerson, hasLoggedDay, highlights, todaysLog } from '@/data';
import { colors, fonts } from '@/theme';

export default function FriendJournal() {
  const { id, date: dateParam } = useLocalSearchParams<{ id: string; date?: string }>();
  const friendId = Array.isArray(id) ? id[0] : id;
  const friend = friendId ? getPerson(friendId) : undefined;
  const date = parseDayParam(dateParam);
  const highlight = highlights.find((item) => item.friendId === friend?.id);

  if (!friend) {
    return (
      <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
        <PageHeader back={{ label: 'Back' }} title={{ title: 'Not found', fontSize: 44, lineHeight: 49.28 }} />
        <Caption>That journal isn’t shared with you.</Caption>
      </Screen>
    );
  }

  if (date && !hasLoggedDay(friend.id, date)) {
    return <NoLogDay date={date} backLabel={friend.name} ownerName={friend.name} />;
  }

  const day = date ? formatLoggedDay(date) : formatLoggedDay(todaysLog.date);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: friend.name }}
        title={{ title: `${friend.name}’s day`, fontSize: 44, lineHeight: 49.28 }}
        subtitle="Shared crumbs · Friends only"
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.author}>
          <Avatar photo={friend.avatar} size={52} />
          <View style={styles.authorText}>
            <Text style={styles.authorName}>{friend.name}</Text>
            <Caption>{friend.handle} · A day they chose to share</Caption>
          </View>
          <Pill
            label="Share"
            icon={require('@assets/icons/share-ink.svg')}
            tintIcons
            onPress={() => router.push(`/share?friend=${friend.id}` as Href)}
          />
        </View>

        <View style={styles.dayNav}>
          <Pill label="‹" onPress={() => {}} />
          <Pill label={day} icon={require('@assets/icons/calendar.svg')} tintIcons tone="selected" />
          <Pill label="›" onPress={() => {}} />
          <Pill label="Year" onPress={() => router.push(`/calendar?friend=${friend.id}` as Href)} />
        </View>

        <SectionHeading label="this day" fontSize={19} ruleOpacity={0.6} />
        <Card>
          <Pill label="Friends" icon={require('@assets/icons/users.svg')} tintIcons tone="selected" />
          <Text style={styles.headline}>A slow shared Saturday.</Text>
          <Caption>
            {todaysLog.location} · {friend.name} logged this day for friends.
          </Caption>
          <ListRow
            title={todaysLog.stops[1]?.name ?? 'Cafe'}
            subtitle={todaysLog.note}
            actionLabel="View day"
            onAction={() => router.push('/log-day')}
          />
        </Card>

        {highlight && (
          <Card>
            <Pill label="Highlight" tone="toast" />
            <Text style={styles.headline}>{highlight.tag}</Text>
            <Photo photo={highlight.photo} style={styles.highlight} />
            <Caption>
              {highlight.date} · A crumb from {friend.name}
            </Caption>
            <ListRow
              title="Chicago"
              subtitle="A place in their journal"
              actionLabel="View crumb"
              onAction={() => router.push(`/crumb/${highlight.id}` as Href)}
            />
          </Card>
        )}

        <SectionHeading label="little moments" fontSize={19} ruleOpacity={0.6} />
        <Photo photo={todaysLog.photos[0]} style={styles.moment} />
        <Caption>Photos they attached to this shared day. Private stops stay off this page.</Caption>

        <Button label={`Back to ${friend.name}`} variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  content: {
    gap: 22,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorText: {
    flex: 1,
    gap: 4,
  },
  authorName: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
  },
  dayNav: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
  },
  highlight: {
    height: 228,
  },
  moment: {
    height: 174,
  },
});
