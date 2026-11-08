import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar, BackButton, Divider, HeroTitle, ListRow, Screen, SegmentedControl, Toggle } from '@/components/ui';
import { currentUser } from '@/data';
import { colors, fonts, shadows } from '@/theme';

type SettingsTab = 'general' | 'sharing';

type Preferences = {
  notifications: boolean;
  locationServices: boolean;
  weeklyEmail: boolean;
  darkMode: boolean;
};

const toggles: { key: keyof Preferences; title: string; subtitle: string }[] = [
  { key: 'notifications', title: 'notifications', subtitle: 'crumbs from friends, weekly wrapped' },
  { key: 'locationServices', title: 'location services', subtitle: 'used to tag crumbs automatically' },
  { key: 'weeklyEmail', title: 'weekly wrapped email', subtitle: 'receive a digest every sunday' },
  { key: 'darkMode', title: 'dark mode', subtitle: 'easier on the eyes at night' },
];

export default function Settings() {
  const [tab, setTab] = useState<SettingsTab>('general');
  const [preferences, setPreferences] = useState<Preferences>({
    notifications: true,
    locationServices: true,
    weeklyEmail: false,
    darkMode: false,
  });

  return (
    <Screen topOffset={-14} paddingHorizontal={34} withTabBar={false}>
      <BackButton iconSize={16} style={styles.back} />

      <HeroTitle title="Profile" height={90} ornamentsLeft={275} style={styles.title} />
      <Text style={styles.subtitle}>profile settings</Text>

      <SegmentedControl
        variant="track"
        segments={[
          { value: 'general', label: 'general' },
          { value: 'sharing', label: 'sharing permissions' },
        ]}
        value={tab}
        onChange={setTab}
        style={styles.tabs}
      />

      <View style={styles.identity}>
        <Avatar
          photo={currentUser.avatar}
          size={108}
          badge={
            <Pressable
              style={styles.editBadge}
              onPress={() => router.push('/edit-profile')}
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
            >
              <Image source={require('@assets/icons/edit.svg')} style={styles.editIcon} />
            </Pressable>
          }
        />
        <Text style={styles.name}>{currentUser.name}</Text>
        <Text style={styles.handle}>{currentUser.handle}</Text>
      </View>

      {tab === 'general' ? (
        <>
          <Divider tone="toast" />
          <ListRow
            variant="settings"
            title="edit profile"
            subtitle="name, bio, profile photo"
            onPress={() => router.push('/edit-profile')}
          />
          {toggles.map((setting) => (
            <ListRow
              key={setting.key}
              variant="settings"
              title={setting.title}
              subtitle={setting.subtitle}
              trailing={
                <Toggle
                  value={preferences[setting.key]}
                  onValueChange={(value) => setPreferences((current) => ({ ...current, [setting.key]: value }))}
                  accessibilityLabel={setting.title}
                />
              }
            />
          ))}
          <ListRow
            variant="settings"
            title="linked accounts"
            subtitle="instagram, google, apple"
            onPress={() => router.push('/linked-accounts')}
          />
          <ListRow
            variant="settings"
            title="privacy"
            subtitle="blocked users, data & activity"
            onPress={() => router.push('/blocked' as Href)}
          />

          <View style={styles.accountActions}>
            <Pressable onPress={() => router.push('/sign-out')} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.signOut}>sign out</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/delete-account' as Href)} accessibilityRole="button" hitSlop={8}>
              <Text style={styles.deleteAccount}>delete account</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Divider tone="toast" />
          <ListRow
            variant="settings"
            title="profile visibility"
            subtitle="who can find you on crumbs"
            onPress={() => router.push('/visibility' as Href)}
          />
          <ListRow
            variant="settings"
            title="share my location"
            subtitle="friends can see where you are today"
            trailing={
              <Toggle
                value={preferences.locationServices}
                onValueChange={(value) => setPreferences((current) => ({ ...current, locationServices: value }))}
                accessibilityLabel="share my location"
              />
            }
          />
          <ListRow
            variant="settings"
            title="blocked users"
            subtitle="people who can’t see your crumbs"
            onPress={() => router.push('/blocked' as Href)}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    marginLeft: 4,
    height: 29,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: colors.paper,
    boxShadow: shadows.lifted,
  },
  title: {
    marginTop: 15,
  },
  subtitle: {
    marginTop: -4,
    height: 32,
    fontFamily: fonts.body,
    fontSize: 22,
    color: colors.bark,
  },
  tabs: {
    marginTop: 8,
  },
  identity: {
    marginTop: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    left: 81,
    top: 82,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.crumb,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    width: 14,
    height: 14,
  },
  name: {
    marginTop: 10,
    height: 30,
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
  },
  handle: {
    height: 20,
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.bark,
  },
  accountActions: {
    marginTop: 16,
    alignItems: 'center',
    gap: 4,
  },
  signOut: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.crumb,
  },
  deleteAccount: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.ink,
  },
});
