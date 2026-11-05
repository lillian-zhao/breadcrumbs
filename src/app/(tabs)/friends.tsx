import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, Button, Divider, Photo, Pill, Screen, TitleRow } from '@/components/ui';
import { featuredFriendIds, getFriend, highlights } from '@/data';
import { colors, fonts } from '@/theme';

const featuredFriends = featuredFriendIds.map(getFriend);

export default function Friends() {
  const [selectedFriendId, setSelectedFriendId] = useState(featuredFriends[0].id);

  return (
    <Screen topOffset={22} paddingHorizontal={24}>
      <TitleRow title="Friends" fontSize={60} lineHeight={69} ornaments="friends" />

      <View style={styles.feed}>
        <View style={styles.friendSelector}>
          {featuredFriends.map((friend) => {
            const isSelected = friend.id === selectedFriendId;
            return (
              <Pressable
                key={friend.id}
                style={styles.friend}
                onPress={() => {
                  setSelectedFriendId(friend.id);
                  router.push(`/friend/${friend.id}` as Href);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
              >
                <Avatar photo={friend.avatar} size={64} ringColor={isSelected ? colors.crumb : colors.sand} />
                <Text style={[styles.friendName, isSelected && styles.friendNameSelected]}>{friend.name}</Text>
              </Pressable>
            );
          })}
        </View>

        <Divider />

        <Button
          label="Check out where your friends recommend"
          size="lg"
          trailingIcon={require('@assets/icons/arrow-cta.svg')}
          trailingIconSize={{ width: 13.332, height: 12.327 }}
          onPress={() => router.navigate('/map')}
          style={styles.recommendations}
        />

        {highlights.map((highlight) => (
          <Pressable
            key={highlight.id}
            style={styles.highlight}
            onPress={() => router.push(`/friend/${highlight.friendId}` as Href)}
            accessibilityRole="button"
          >
            <Text style={styles.highlightTitle}>{getFriend(highlight.friendId).name}’s recent highlight</Text>
            <View style={styles.highlightDetails}>
              <View style={styles.tags}>
                <Pill label={highlight.tag} size="tag" tone="toast" />
                <Pill label={highlight.date} size="tag" tone="outline" />
              </View>
              <Pill
                label="crumbs"
                size="action"
                tone="plain"
                trailingIcon={require('@assets/icons/arrow-up-right.svg')}
              />
            </View>
            <Photo photo={highlight.photo} style={styles.highlightPhoto} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  feed: {
    paddingTop: 24,
    gap: 28,
  },
  friendSelector: {
    flexDirection: 'row',
    gap: 18,
  },
  friend: {
    width: 63,
    height: 94,
    alignItems: 'center',
    gap: 8,
  },
  friendName: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.bark,
  },
  friendNameSelected: {
    color: colors.crumb,
  },
  recommendations: {
    width: 352,
  },
  highlight: {
    gap: 12,
  },
  highlightTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
  },
  highlightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tags: {
    flexDirection: 'row',
    gap: 7,
  },
  highlightPhoto: {
    height: 228,
  },
});
