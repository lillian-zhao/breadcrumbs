import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Caption,
  ListRow,
  PageHeader,
  Pill,
  Screen,
  SectionHeading,
  StatusMessage,
  Toggle,
} from '@/components/ui';

type Visibility = 'everyone' | 'friends' | 'nobody';

const copy: Record<Visibility, { title: string; body: string }> = {
  everyone: {
    title: 'Anyone can find you',
    body: 'People can search your name and see the crumbs you share with friends. Private days stay private.',
  },
  friends: {
    title: 'Friends can find you',
    body: 'Only people you follow back will see your profile in search. Everyone else sees a limited card.',
  },
  nobody: {
    title: 'You’re hidden from search',
    body: 'Friends you already share with can still see your crumbs. New people won’t find this profile.',
  },
};

export default function ProfileVisibility() {
  const [visibility, setVisibility] = useState<Visibility>('friends');
  const [searchable, setSearchable] = useState(true);
  const [exploreMap, setExploreMap] = useState(false);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Settings' }}
        title={{ title: 'Who can find you.', fontSize: 44, lineHeight: 49.28 }}
        subtitle="Profile visibility · who can find you on crumbs"
        style={styles.header}
      />

      <View style={styles.content}>
        <SectionHeading label="profile visibility" fontSize={19} ruleOpacity={0.6} />
        <View style={styles.pills}>
          <Pill
            label="Everyone"
            tone={visibility === 'everyone' ? 'selected' : 'default'}
            onPress={() => setVisibility('everyone')}
          />
          <Pill
            label="Friends"
            icon={require('@assets/icons/users.svg')}
            tintIcons
            tone={visibility === 'friends' ? 'selected' : 'default'}
            onPress={() => setVisibility('friends')}
          />
          <Pill
            label="Only me"
            icon={require('@assets/icons/lock.svg')}
            tintIcons
            tone={visibility === 'nobody' ? 'selected' : 'default'}
            onPress={() => setVisibility('nobody')}
          />
        </View>
        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title={copy[visibility].title}
          body={copy[visibility].body}
        />

        <SectionHeading label="discovery" fontSize={19} ruleOpacity={0.6} />
        <ListRow
          variant="settings"
          title="appear in people search"
          subtitle="friends of friends can still find you"
          trailing={
            <Toggle
              value={searchable && visibility !== 'nobody'}
              onValueChange={setSearchable}
              accessibilityLabel="appear in people search"
            />
          }
        />
        <ListRow
          variant="settings"
          title="show crumbs on explore map"
          subtitle="shared stops can appear near friends"
          trailing={
            <Toggle value={exploreMap} onValueChange={setExploreMap} accessibilityLabel="show crumbs on explore map" />
          }
        />
        <Caption>
          Private days never appear on the map. Changing visibility doesn’t notify anyone, and you can tighten this anytime.
        </Caption>

        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" fill onPress={() => router.back()} />
          <Button label="Save" fill onPress={() => router.back()} />
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
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
