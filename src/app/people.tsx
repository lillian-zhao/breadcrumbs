import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useConnections } from '@/connections';
import {
  Button,
  Caption,
  PageHeader,
  PersonRow,
  Pill,
  Screen,
  SearchField,
  SectionHeading,
  StatusMessage,
} from '@/components/ui';
import {
  currentUser,
  followerIds,
  friends,
  friendsOfFriends,
  getPerson,
  matchesPersonQuery,
  mutualLabel,
  people,
} from '@/data';

type PeopleTab = 'followers' | 'following';

function asTab(value: string | string[] | undefined): PeopleTab {
  const tab = Array.isArray(value) ? value[0] : value;
  return tab === 'following' ? 'following' : 'followers';
}

export default function People() {
  const { tab: tabParam } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<PeopleTab>(() => asTab(tabParam));
  const [query, setQuery] = useState('');
  const { isFollowing, toggleFollow, followingIds } = useConnections();

  const followers = useMemo(
    () => followerIds.map(getPerson).filter((person) => person && matchesPersonQuery(person, query)),
    [query],
  );
  const following = useMemo(
    () => [...followingIds].map(getPerson).filter((person) => person && matchesPersonQuery(person, query)),
    [followingIds, query],
  );
  const searching = query.trim().length > 0;
  const searchResults = useMemo(
    () => people.filter((person) => matchesPersonQuery(person, query)),
    [query],
  );
  const familiarFaces = useMemo(
    () =>
      friends.filter(
        (person) =>
          !isFollowing(person.id) &&
          !friendsOfFriends.some((suggestion) => suggestion.id === person.id) &&
          matchesPersonQuery(person, query),
      ),
    [isFollowing, query],
  );
  const suggestedFriends = useMemo(
    () =>
      friendsOfFriends.filter((suggestion) => {
        const person = getPerson(suggestion.id);
        return person && !isFollowing(person.id) && matchesPersonQuery(person, query);
      }),
    [isFollowing, query],
  );

  const list = tab === 'followers' ? followers : following;
  const listLabel = tab === 'followers' ? 'followers' : 'following';

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} contentWidth={402} withTabBar={false}>
      <PageHeader
        back={{ label: 'Profile' }}
        title={{ title: 'Your people', fontSize: 44, lineHeight: 49.28 }}
        subtitle={`${currentUser.name} · ${currentUser.handle}`}
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.tabs}>
          <Pill
            label={`Followers · ${followerIds.length}`}
            tone={tab === 'followers' ? 'selected' : 'default'}
            onPress={() => setTab('followers')}
          />
          <Pill
            label={`Following · ${followingIds.size}`}
            tone={tab === 'following' ? 'selected' : 'default'}
            onPress={() => setTab('following')}
          />
        </View>

        <SearchField value={query} onChangeText={setQuery} placeholder="Search people" />

        {searching ? (
          <>
            <SectionHeading label="people" fontSize={19} ruleOpacity={0.6} />
            {searchResults.length === 0 ? (
              <Caption>No one matches “{query.trim()}”. Try a name or @handle.</Caption>
            ) : (
              searchResults.map((person) => (
                <PersonRow
                  key={person.id}
                  name={person.name}
                  subtitle={
                    isFollowing(person.id)
                      ? `${person.handle} · Following`
                      : followerIds.includes(person.id)
                        ? `${person.handle} · Follows you`
                        : person.handle
                  }
                  photo={person.avatar}
                  actionLabel={isFollowing(person.id) ? 'Following' : 'Follow'}
                  actionSelected={isFollowing(person.id)}
                  onAction={() => toggleFollow(person.id)}
                  onPress={() => router.push(`/friend/${person.id}` as Href)}
                />
              ))
            )}
          </>
        ) : (
          <>
            <SectionHeading label={listLabel} fontSize={19} ruleOpacity={0.6} />
            {list.map(
              (person) =>
                person && (
                  <PersonRow
                    key={person.id}
                    name={person.name}
                    subtitle={
                      tab === 'followers' ? `${person.handle} · Follows you` : `${person.handle} · Following`
                    }
                    photo={person.avatar}
                    actionLabel={isFollowing(person.id) ? 'Following' : 'Follow'}
                    actionSelected={isFollowing(person.id)}
                    onAction={() => toggleFollow(person.id)}
                    onPress={() => router.push(`/friend/${person.id}` as Href)}
                  />
                ),
            )}
            <Caption>
              You’re following {followingIds.size} {followingIds.size === 1 ? 'person' : 'people'}. Switch to
              Following to manage that list. Open any person to view their shared profile.
            </Caption>
          </>
        )}

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="A small circle, good discoveries"
          body="Following doesn’t unlock private crumbs. Everyone chooses what they share."
        />

        {!searching && suggestedFriends.length > 0 && (
          <>
            <SectionHeading label="friends of friends" fontSize={19} ruleOpacity={0.6} />
            <Caption>People in your circle’s circle. Follow to see the crumbs they choose to share.</Caption>
            {suggestedFriends.map((suggestion) => {
              const person = getPerson(suggestion.id);
              if (!person) return null;
              return (
                <PersonRow
                  key={person.id}
                  name={person.name}
                  subtitle={`${person.handle} · ${mutualLabel(suggestion.via)}`}
                  photo={person.avatar}
                  actionLabel={isFollowing(person.id) ? 'Following' : 'Follow'}
                  actionSelected={isFollowing(person.id)}
                  onAction={() => toggleFollow(person.id)}
                  onPress={() => router.push(`/friend/${person.id}` as Href)}
                />
              );
            })}
          </>
        )}

        {!searching && familiarFaces.length > 0 && (
          <>
            <SectionHeading label="find a familiar face" fontSize={19} ruleOpacity={0.6} />
            {familiarFaces.map((person) => (
              <PersonRow
                key={person.id}
                name={person.name}
                subtitle={person.handle}
                photo={person.avatar}
                actionLabel={isFollowing(person.id) ? 'Following' : 'Follow'}
                actionSelected={isFollowing(person.id)}
                onAction={() => toggleFollow(person.id)}
                onPress={() => router.push(`/friend/${person.id}` as Href)}
              />
            ))}
          </>
        )}

        <Button label="Back to Profile" variant="secondary" onPress={() => router.back()} />
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
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
});
