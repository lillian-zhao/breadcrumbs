import { Image } from 'expo-image';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';

import {
  Button,
  Caption,
  ListRow,
  PersonRow,
  Photo,
  Pill,
  Screen,
  SectionHeading,
  StatusMessage,
} from '@/components/ui';
import { currentUser, friends, getPerson, weeklyWrapped } from '@/data';
import { colors, fonts } from '@/theme';

export default function ShareMemory() {
  const { friend: friendParam } = useLocalSearchParams<{ friend?: string }>();
  const friendId = Array.isArray(friendParam) ? friendParam[0] : friendParam;
  const friend = friendId ? getPerson(friendId) : undefined;
  const people = useMemo(
    () => friends.filter((person) => person.id !== friend?.id),
    [friend?.id],
  );
  const [sentIds, setSentIds] = useState<string[]>(() => (people[0] ? [people[0].id] : []));
  const [copied, setCopied] = useState(false);
  const title = friend ? `${friend.name}’s week.` : 'Your week.';
  const preview = friend ? friend.avatar : weeklyWrapped[0];
  const subtitle = friend ? `${friend.name} · A shared recap` : `${currentUser.name} · Sep 28 – Oct 4, 2026`;

  const toggleSent = (id: string) => {
    setSentIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.heading}>
          <Text style={styles.title}>Share this crumb?</Text>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close">
            <Image source={require('@assets/icons/close.svg')} style={styles.close} />
          </Pressable>
        </View>

        <View style={styles.preview}>
          <Photo photo={preview} style={styles.previewPhoto} />
          <View style={styles.previewCopy}>
            <Text style={styles.previewTitle}>{title}</Text>
            <Caption>{subtitle}</Caption>
            <Pill label="Private" icon={require('@assets/icons/lock.svg')} tintIcons />
          </View>
        </View>

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="This memory is private"
          body="Friends you send it to can see this crumb. It stays private to everyone else until you copy a link."
        />

        <SectionHeading label="send to a friend" fontSize={19} ruleOpacity={0.6} />
        {people.map((person) => {
          const sent = sentIds.includes(person.id);
          return (
            <PersonRow
              key={person.id}
              name={person.name}
              subtitle={sent ? 'Can see this crumb' : 'Send a private copy'}
              photo={person.avatar}
              actionLabel={sent ? 'Sent' : 'Send'}
              actionSelected={sent}
              onAction={() => toggleSent(person.id)}
              onPress={() => router.push(`/friend/${person.id}` as Href)}
            />
          );
        })}

        <Button
          label={sentIds.length > 0 ? `Send to ${sentIds.length} friend${sentIds.length === 1 ? '' : 's'}` : 'Choose a friend'}
          icon={require('@assets/icons/send.svg')}
          disabled={sentIds.length === 0}
          onPress={() => router.back()}
        />

        <ListRow
          icon={require('@assets/icons/link.svg')}
          title="Copy a private link"
          subtitle={copied ? 'Copied · Anyone with the link can view this crumb' : 'Share outside Breadcrumbs'}
          actionLabel={copied ? 'Copied' : 'Copy'}
          onAction={() => setCopied(true)}
        />

        {copied && (
          <StatusMessage
            icon={require('@assets/icons/check.svg')}
            title="Link copied"
            body="Anyone with the link can view this crumb until you turn sharing off. It isn’t posted anywhere yet."
          />
        )}

        <Button
          label="Share elsewhere"
          variant="secondary"
          icon={require('@assets/icons/share-ink.svg')}
          onPress={() => {
            void Share.share({ title, message: `${title} ${subtitle}` }).catch(() => setCopied(true));
          }}
        />
        <Caption>Instagram and other apps stay unconnected until you link them in settings.</Caption>
        <Button label="Cancel · Keep private" variant="secondary" onPress={() => router.back()} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: 22,
  },
  handle: {
    alignSelf: 'center',
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.sand,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 29,
    lineHeight: 34,
    color: colors.ink,
  },
  close: {
    width: 20,
    height: 20,
  },
  preview: {
    flexDirection: 'row',
    gap: 12,
  },
  previewPhoto: {
    width: 92,
    height: 92,
  },
  previewCopy: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  previewTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.ink,
  },
});
