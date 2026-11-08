import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Image } from 'expo-image';

import { Avatar, Button, Caption, ListRow, Screen, SectionHeading, StatusMessage } from '@/components/ui';
import { currentUser } from '@/data';
import { useSession } from '@/session';
import { colors, fonts } from '@/theme';

export default function SignOut() {
  const { signOut } = useSession();

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.heading}>
          <Text style={styles.title}>See you in a little while?</Text>
          <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Close">
            <Image source={require('@assets/icons/close.svg')} style={styles.close} />
          </Pressable>
        </View>

        <View style={styles.identity}>
          <Avatar photo={currentUser.avatar} size={64} />
          <View style={styles.identityText}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Caption>{currentUser.handle} · Currently signed in</Caption>
          </View>
        </View>

        <Text style={styles.body}>
          You’re about to sign out on this device. Your days, photos and saved spots will be here when you return.
        </Text>

        <SectionHeading label="nothing gets deleted" fontSize={19} ruleOpacity={0.6} />
        <ListRow
          title={`${currentUser.daysLogged} days logged`}
          subtitle="Kept safely in your account"
          actionLabel="Kept"
        />
        <ListRow title="Your photos & saved places" subtitle="Available when you sign in again" actionLabel="Kept" />

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="This is not account deletion"
          body="Sign out only ends this device’s session. You can return using the same sign-in method."
        />

        <View style={styles.actions}>
          <Button label="Stay signed in" variant="secondary" fill onPress={() => router.back()} />
          <Button label="Sign out" fill onPress={signOut} />
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
  identity: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  identityText: {
    flex: 1,
    gap: 5,
  },
  name: {
    fontFamily: fonts.display,
    fontSize: 23,
    lineHeight: 27,
    color: colors.ink,
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
