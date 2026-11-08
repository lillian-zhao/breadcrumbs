import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Card, PageHeader, Pill, Screen, SearchField, SectionHeading, StatusMessage } from '@/components/ui';
import { blockedUsers, type BlockedUser } from '@/data';
import { colors, fonts } from '@/theme';

export default function BlockedUsers() {
  const [query, setQuery] = useState('');
  const [people, setPeople] = useState(blockedUsers);
  const [pending, setPending] = useState<BlockedUser>();

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return people;
    return people.filter(
      (person) => person.name.toLowerCase().includes(needle) || person.handle.toLowerCase().includes(needle),
    );
  }, [people, query]);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Settings' }}
        title={{ title: 'Blocked users', fontSize: 44, lineHeight: 49.28 }}
        subtitle="People who can’t see your crumbs"
        style={styles.header}
      />

      <View style={styles.content}>
        <SearchField value={query} onChangeText={setQuery} placeholder="Search blocked people" />
        <Caption>
          Blocking hides your profile and shared crumbs from that person. They won’t be notified, and you can unblock
          anytime.
        </Caption>

        <SectionHeading label="blocked" fontSize={19} ruleOpacity={0.6} />
        {visible.map((person) => (
          <View key={person.id} style={styles.person}>
            <View style={styles.initials}>
              <Text style={styles.initialsLabel}>{person.initials}</Text>
            </View>
            <View style={styles.identity}>
              <Text style={styles.name}>{person.name}</Text>
              <Caption>
                {person.handle} · {person.detail}
              </Caption>
            </View>
            <Pill label="Unblock" onPress={() => setPending(person)} />
          </View>
        ))}
        {visible.length === 0 && (
          <Caption>
            {people.length === 0
              ? 'You’re not blocking anyone right now. That’s a small, good circle.'
              : `No blocked people match “${query.trim()}”.`}
          </Caption>
        )}

        {pending && (
          <Card>
            <Text style={styles.cardTitle}>Unblock {pending.name}?</Text>
            <Caption>
              They’ll be able to find your profile again and see the crumbs you share with friends. You can always block
              them later.
            </Caption>
            <Caption>They won’t get a notification from Breadcrumbs.</Caption>
            <View style={styles.actions}>
              <Button label="Keep blocked" variant="secondary" fill onPress={() => setPending(undefined)} />
              <Button
                label="Unblock"
                fill
                onPress={() => {
                  setPeople((current) => current.filter((person) => person.id !== pending.id));
                  setPending(undefined);
                }}
              />
            </View>
          </Card>
        )}

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="You’re in control"
          body="Blocked people can’t follow you, see your shared days, or show up in people search."
        />

        <Button label="Back to Settings" variant="secondary" onPress={() => router.back()} />
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
  person: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  initials: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.track,
  },
  initialsLabel: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  identity: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 19,
    lineHeight: 22.42,
    color: colors.ink,
  },
  cardTitle: {
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 27,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
