import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

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
import { getCrumb, getPerson, getPlace } from '@/data';
import { colors, fonts } from '@/theme';

export default function FriendCrumbDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const crumbId = Array.isArray(id) ? id[0] : id;
  const crumb = crumbId ? getCrumb(crumbId) : undefined;
  const friend = crumb ? getPerson(crumb.friendId) : undefined;
  const place = crumb ? getPlace(crumb.placeId) : undefined;

  if (!crumb || !friend) {
    return (
      <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
        <PageHeader back={{ label: 'Back' }} title={{ title: 'Not found', fontSize: 44, lineHeight: 49.28 }} />
        <Caption>That crumb isn’t shared with you.</Caption>
      </Screen>
    );
  }

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: friend.name }}
        title={{ title: crumb.place, fontSize: 44, lineHeight: 49.28 }}
        subtitle={`${friend.name}’s crumb · ${crumb.time}`}
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.author}>
          <Avatar photo={friend.avatar} size={52} />
          <View style={styles.authorText}>
            <Text style={styles.authorName}>{friend.name}</Text>
            <Caption>
              {friend.handle} · {crumb.city}
            </Caption>
          </View>
          <Pill
            label="Share"
            icon={require('@assets/icons/share-ink.svg')}
            tintIcons
            onPress={() => router.push(`/share?friend=${friend.id}` as Href)}
          />
        </View>

        <Photo photo={crumb.photo} style={styles.hero} />
        <Caption>
          {crumb.time} · A stop {friend.name} chose to share. Private days stay off this page.
        </Caption>

        <Card>
          <Pill label="Friends" icon={require('@assets/icons/users.svg')} tintIcons tone="selected" />
          <Text style={styles.note}>{crumb.note}</Text>
          <ListRow
            icon={require('@assets/icons/map-pin-row.svg')}
            title={crumb.place}
            subtitle={`${crumb.city} · ${crumb.time}`}
            actionLabel="View place"
            onAction={() => router.push(`/place/${crumb.placeId}` as Href)}
          />
        </Card>

        <SectionHeading label="this stop" fontSize={19} ruleOpacity={0.6} />
        {place && (
          <ListRow
            title={place.name}
            subtitle={`${place.city} · ${place.category}`}
            actionLabel="Open"
            onAction={() => router.push(`/place/${place.id}` as Href)}
          />
        )}
        <ListRow
          title={`${friend.name}’s day`}
          subtitle="See the rest of the crumbs they shared today"
          actionLabel="Journal"
          onAction={() => router.push(`/journal/${friend.id}` as Href)}
        />

        <View style={styles.actions}>
          <Button
            label="See on map"
            variant="secondary"
            icon={require('@assets/icons/map-pin-row.svg')}
            fill
            onPress={() => router.push(`/map-day/${friend.id}` as Href)}
          />
          <Button label={`Back to ${friend.name}`} fill onPress={() => router.back()} />
        </View>
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
  hero: {
    height: 284,
  },
  note: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
