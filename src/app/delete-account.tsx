import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Image } from 'expo-image';

import { Button, Caption, ListRow, Screen, SectionHeading, StatusMessage, TextField } from '@/components/ui';
import { currentUser } from '@/data';
import { useSession } from '@/session';
import { colors, fonts } from '@/theme';

export default function DeleteAccount() {
  const { signOut } = useSession();
  const [confirmation, setConfirmation] = useState('');
  const ready = confirmation.trim().toUpperCase() === 'DELETE';

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.heading}>
          <Text style={styles.title}>Delete this account?</Text>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close">
            <Image source={require('@assets/icons/close.svg')} style={styles.close} />
          </Pressable>
        </View>

        <View style={styles.warning}>
          <Text style={styles.warningLabel}>Permanent · Can’t be undone</Text>
        </View>

        <Text style={styles.body}>
          This removes {currentUser.name}’s days, photos, saved spots and friend connections from Breadcrumbs on every
          device.
        </Text>

        <SectionHeading label="this will be gone" fontSize={19} ruleOpacity={0.6} />
        <ListRow title={`${currentUser.daysLogged} days logged`} subtitle="Your journal and weekly recaps" actionLabel="Removed" />
        <ListRow title="Photos & saved places" subtitle="Spots, photos and crumbs" actionLabel="Removed" />
        <ListRow title="Friends & follows" subtitle="Your people list on this account" actionLabel="Removed" />

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="This is not signing out"
          body="Sign out keeps everything. Deleting the account erases it. Type DELETE below to confirm."
        />

        <TextField
          label="Type DELETE to confirm"
          value={confirmation}
          onChangeText={setConfirmation}
          placeholder="DELETE"
          helper="Use all caps, just like that."
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <Caption>Friends keep their own crumbs. Only your account and the things you posted are removed.</Caption>

        <View style={styles.actions}>
          <Button label="Keep account" variant="secondary" fill onPress={() => router.back()} />
          <Button
            label="Delete account"
            fill
            disabled={!ready}
            onPress={() => {
              signOut();
              router.replace('/account-deleted' as Href);
            }}
          />
        </View>
        <Button label="Cancel · Back to Settings" variant="secondary" onPress={() => router.back()} />
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
  warning: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 28,
    backgroundColor: colors.crumb,
  },
  warningLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.white,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.ink,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
});
