import { router, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useConnections } from '@/connections';
import {
  Avatar,
  Button,
  Divider,
  PersonRow,
  Photo,
  Pill,
  Screen,
  SearchField,
  SectionHeading,
  TitleRow,
} from '@/components/ui';
import { friendsOfFriends, getPerson, mutualLabel, useFriends, useHighlights, usePeopleSearch } from '@/data';
import { colors, fonts } from '@/theme';

function matchesFriend(friend: { name: string; handle: string }, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return friend.name.toLowerCase().includes(needle) || friend.handle.toLowerCase().includes(needle);
}

export default function Friends() {
  const { data: friends = [] } = useFriends();
  const { data: highlights = [] } = useHighlights();
  const [query, setQuery] = useState('');
  const { data: peopleResults = [] } = usePeopleSearch(query);
  const [selectedFriendId, setSelectedFriendId] = useState<string>();
  const { isFollowing, isRequested, toggleFollow } = useConnections();

  const searching = query.trim().length > 0;
  const selectedId = selectedFriendId ?? friends[0]?.id;

  const visibleFriends = useMemo(
    () => friends.filter((friend) => matchesFriend(friend, query)),
    [friends, query],
  );
  const visibleHighlights = useMemo(
    () => highlights.filter((highlight) => matchesFriend({ name: highlight.friendName ?? '', handle: '' }, query)),
    [highlights, query],
  );
  const suggestedFriends = useMemo(
    () =>
      friendsOfFriends.filter((suggestion) => {
        const person = getPerson(suggestion.id);
        return person && !isFollowing(person.id) && matchesFriend(person, query);
      }),
    [isFollowing, query],
  );

  return (
    <Screen topOffset={22} paddingHorizontal={24}>
      <TitleRow title="Friends" fontSize={60} lineHeight={69} ornaments="friends" />

      <View style={styles.feed}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search friends" />

        {searching ? (
          <>
            <SectionHeading label="people" fontSize={19} ruleOpacity={0.6} />
            {peopleResults.length === 0 ? (
              <Text style={styles.empty}>No one matches “{query.trim()}”.</Text>
            ) : (
              peopleResults.map((person) => (
                <PersonRow
                  key={person.id}
                  name={person.name}
                  subtitle={person.handle}
                  photo={person.avatar}
                  actionLabel={isFollowing(person.id) ? 'Following' : isRequested(person.id) ? 'Requested' : 'Follow'}
                  actionSelected={isFollowing(person.id) || isRequested(person.id)}
                  onAction={isRequested(person.id) ? undefined : () => toggleFollow(person.id)}
                  onPress={() => router.push('/friend/' + person.id as Href)}
                />
              ))
            )}
          </>
        ) : (
          <>
            {visibleFriends.length > 0 && (
              <View style={styles.friendSelector}>
                {visibleFriends.map((friend) => {
                  const isSelected = friend.id === selectedId;
                  return (
                    <Pressable
                      key={friend.id}
                      style={styles.friend}
                      onPress={() => {
                        setSelectedFriendId(friend.id);
                        router.push('/friend/' + friend.id as Href);
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
            )}

            <Button
              label="Find people"
              variant="secondary"
              trailingIcon={require('@assets/icons/arrow-cta.svg')}
              trailingIconSize={{ width: 13.332, height: 12.327 }}
              onPress={() => router.push('/people' as Href)}
            />

            <Divider />

            <Button
              label="Check out where your friends recommend"
              size="lg"
              trailingIcon={require('@assets/icons/arrow-cta.svg')}
              trailingIconSize={{ width: 13.332, height: 12.327 }}
              onPress={() => router.push('/recommend' as Href)}
              style={styles.recommendations}
            />

            {suggestedFriends.length > 0 && (
              <View style={styles.suggestions}>
                <SectionHeading label="friends of friends" fontSize={19} ruleOpacity={0.6} />
                {suggestedFriends.map((suggestion) => {
                  const person = getPerson(suggestion.id);
                  if (!person) return null;
                  return (
                    <PersonRow
                      key={person.id}
                      name={person.name}
                      subtitle={mutualLabel(suggestion.via)}
                      photo={person.avatar}
                      actionLabel={isFollowing(person.id) ? 'Following' : isRequested(person.id) ? 'Requested' : 'Follow'}
                      actionSelected={isFollowing(person.id) || isRequested(person.id)}
                      onAction={isRequested(person.id) ? undefined : () => toggleFollow(person.id)}
                      onPress={() => router.push('/friend/' + person.id as Href)}
                    />
                  );
                })}
              </View>
            )}

            {visibleHighlights.map((highlight) => (
              <Pressable
                key={highlight.id}
                style={styles.highlight}
                onPress={() => router.push('/crumb/' + highlight.id as Href)}
                accessibilityRole="button"
              >
                <Text style={styles.highlightTitle}>{highlight.friendName ?? 'A friend'}’s recent highlight</Text>
                <View style={styles.highlightDetails}>
                  <View style={styles.tags}>
                    <Pill label={highlight.tag} size="tag" tone="toast" />
                    <Pill label={highlight.date} size="tag" tone="outline" />
                  </View>
                  <Pill label="crumbs" size="action" tone="plain" trailingIcon={require('@assets/icons/arrow-up-right.svg')} />
                </View>
                <Photo photo={highlight.photo} style={styles.highlightPhoto} />
              </Pressable>
            ))}
          </>
        )}
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
  suggestions: {
    gap: 16,
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
  empty: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.caption,
  },
});
