import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
import { friends, friendWeeks, getFriend, highlights } from '@/data';
import { colors, fonts } from '@/theme';

export default function FriendProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const friendId = Array.isArray(id) ? id[0] : id;
  const friend = friends.some((candidate) => candidate.id === friendId) ? getFriend(friendId) : getFriend('annie');
  const highlight = highlights.find((item) => item.friendId === friend.id) ?? highlights[0];
  const week = friendWeeks.find((item) => item.friendId === friend.id);
  const [following, setFollowing] = useState(true);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Back' }}
        title={{ title: friend.name, fontSize: 44, lineHeight: 49.28 }}
        subtitle="A friend’s corner of Crumbs"
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.identity}>
          <Avatar photo={friend.avatar} size={104} />
          <Text style={styles.name}>{friend.name}</Text>
          <Text style={styles.handle}>{friend.handle}</Text>
          <Pill
            label={following ? 'Following' : 'Follow'}
            icon={following ? require('@assets/icons/check.svg') : undefined}
            tintIcons
            tone={following ? 'selected' : 'default'}
            onPress={() => setFollowing((value) => !value)}
          />
        </View>

        <Card>
          <Text style={styles.bio}>{friend.bio}</Text>
          <Caption>Friends only · You can see {friend.name}’s shared crumbs.</Caption>
        </Card>

        <SectionHeading label="recent highlight" fontSize={19} ruleOpacity={0.6} />
        <Photo photo={highlight.photo} style={styles.highlight} />
        <ListRow
          title={highlight.tag}
          subtitle={`Chicago · ${highlight.date}`}
          actionLabel="View crumb"
          onAction={() => {}}
        />

        <SectionHeading label="discover together" fontSize={19} ruleOpacity={0.6} />
        <ListRow
          title="Shared spots"
          subtitle="HeyTea · A place in both your circles"
          actionLabel="View place"
          onAction={() => router.push('/map')}
        />
        <ListRow
          icon={require('@assets/icons/bookmark.svg')}
          iconTint={colors.crumb}
          title="Saved places"
          subtitle={`Places ${friend.name} chooses to share`}
          actionLabel="View saved"
          onAction={() => router.push('/saved-spots')}
        />
        <ListRow
          title={`${friend.name}’s weekly wrapped`}
          subtitle={week ? `${week.places} places · ${week.newPlaces} new` : 'This week’s recap'}
          actionLabel="View recap"
        />

        <Caption>Private days, follower totals and visit history are not shown here.</Caption>
        <Button label="Back to your people" variant="secondary" onPress={() => router.back()} />
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
  identity: {
    alignItems: 'center',
    gap: 10,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 33,
    color: colors.ink,
    textAlign: 'center',
  },
  handle: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.caption,
    textAlign: 'center',
  },
  bio: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.ink,
  },
  highlight: {
    height: 228,
  },
});
