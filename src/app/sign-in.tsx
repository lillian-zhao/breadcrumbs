import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Photo, Screen, SectionHeading, StatusMessage, TextField, TitleRow } from '@/components/ui';
import { useSession } from '@/session';
import { colors, fonts, radii } from '@/theme';

const keepsakes = [
  {
    caption: 'A little pick-me-up',
    rotate: '-3deg',
    photo: { source: require('@assets/photos/bubble-tea.png') },
  },
  {
    caption: 'A sweet little day',
    rotate: '3deg',
    photo: { source: require('@assets/photos/dessert-cups.png') },
  },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const { signIn } = useSession();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  const sendLink = () => {
    if (!emailPattern.test(email.trim())) {
      setError('Enter the email linked to your Crumbs account.');
      setSent(false);
      return;
    }
    setError(undefined);
    setSent(true);
  };

  return (
    <Screen edge="statusBar" topOffset={7} paddingHorizontal={24} contentWidth={402} withTabBar={false}>
      <View style={styles.header}>
        <TitleRow title="Crumbs" fontSize={44} lineHeight={49.28} />
        <Text style={styles.tagline}>Little places. A life remembered.</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.collage}>
          {keepsakes.map((keepsake) => (
            <View key={keepsake.caption} style={[styles.keepsakeTilt, { transform: [{ rotate: keepsake.rotate }] }]}>
              <View style={styles.keepsake}>
                <Photo photo={keepsake.photo} style={styles.keepsakePhoto} />
                <Text style={styles.keepsakeCaption}>{keepsake.caption}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.welcome}>Welcome back.</Text>
        <Text style={styles.memories}>Your memories are right where you left them.</Text>

        <TextField
          label="Email address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError(undefined);
            setSent(false);
          }}
          placeholder="you@example.com"
          helper={error ?? 'Use the email linked to your Crumbs account.'}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Button label="Email me a sign-in link" onPress={sendLink} />

        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title={sent ? 'We sent a sign-in link' : 'Check your inbox after sending'}
          body={
            sent
              ? `Open the link sent to ${email.trim()} to continue. For this preview, you can open it here.`
              : 'The secure link signs you in without a password. If it doesn’t arrive, check spam or send a new link.'
          }
        />

        {sent && <Button label="Open link to continue" onPress={signIn} />}

        <SectionHeading label="or return with" fontSize={19} ruleOpacity={0.6} />
        <Button label="Continue with Google ↗" variant="secondary" onPress={signIn} />
        <Button label="Continue with Apple ↗" variant="secondary" onPress={signIn} />
        <Caption>
          Google and Apple open a secure sign-in handoff. Return with your existing account to find your Profile and
          saved crumbs.
        </Caption>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 20,
    paddingBottom: 24,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18.85,
    color: colors.bark,
  },
  content: {
    gap: 22,
    paddingBottom: 28,
  },
  collage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  keepsakeTilt: {
    width: 180,
    height: 214,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keepsake: {
    width: 170,
    gap: 7,
    padding: 7,
    backgroundColor: colors.cream,
    borderRadius: radii.card,
  },
  keepsakePhoto: {
    width: 156,
    height: 167,
  },
  keepsakeCaption: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.ink,
    textAlign: 'center',
  },
  welcome: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 37.76,
    color: colors.ink,
  },
  memories: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20.3,
    color: colors.caption,
  },
});
