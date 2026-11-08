import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Photo, Screen, SectionHeading, StatusMessage, TextField, TitleRow } from '@/components/ui';
import { useSession } from '@/session';
import { colors, fonts, radii } from '@/theme';

const keepsakes = [
  { caption: 'A little pick-me-up', rotate: '-3deg', photo: { source: require('@assets/photos/bubble-tea.png') } },
  { caption: 'A sweet little day', rotate: '3deg', photo: { source: require('@assets/photos/dessert-cups.png') } },
] as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function authErrorMessage(reason: unknown): string {
  const message = reason instanceof Error ? reason.message : String(reason);
  if (message.includes('auth/invalid-credential')) return 'Incorrect email or password.';
  if (message.includes('auth/email-already-in-use')) return 'That email is already in use. Try signing in instead.';
  if (message.includes('auth/weak-password')) return 'Password is too weak. Use at least 6 characters.';
  if (message.includes('auth/invalid-email')) return 'That email address is not valid.';
  if (message.includes('auth/network-request-failed')) return 'Network error. Check your connection and try again.';
  if (message.includes('auth/too-many-requests')) return 'Too many attempts. Try again in a moment.';
  return message;
}

export default function SignIn() {
  const { signIn, signUp } = useSession();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async () => {
    const trimmedEmail = email.trim();
    if (!emailPattern.test(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Enter the name friends will see.');
      return;
    }

    setError(undefined);
    setSubmitting(true);
    try {
      if (mode === 'signup') await signUp(trimmedEmail, password, name.trim());
      else await signIn(trimmedEmail, password);
    } catch (reason) {
      setError(authErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
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

        <Text style={styles.welcome}>{mode === 'signup' ? 'Join Crumbs.' : 'Welcome back.'}</Text>
        <Text style={styles.memories}>
          {mode === 'signup' ? 'Make an account to start your trail.' : 'Your memories are right where you left them.'}
        </Text>

        {mode === 'signup' && (
          <TextField
            label="Name"
            value={name}
            onChangeText={(value) => {
              setName(value);
              setError(undefined);
            }}
            placeholder="Your name"
          />
        )}

        <TextField
          label="Email address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            setError(undefined);
          }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="emailAddress"
        />

        <TextField
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setError(undefined);
          }}
          placeholder="At least 6 characters"
          secureTextEntry
          textContentType={mode === 'signup' ? 'newPassword' : 'password'}
        />

        {error && (
          <StatusMessage icon={require('@assets/icons/info.svg')} title="Could not continue" body={error} />
        )}

        <Button label={submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'} onPress={submitting ? undefined : submit} />

        <SectionHeading label="or" fontSize={19} ruleOpacity={0.6} />
        <Button
          label={mode === 'signup' ? 'I already have an account' : 'New here? Create an account'}
          variant="secondary"
          onPress={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup');
            setError(undefined);
          }}
        />
        <Caption>
          {mode === 'signup'
            ? 'Creating an account stores your profile, crumbs and saved places in your Firebase account.'
            : 'Google and Apple sign-in will be added once those providers are configured.'}
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
