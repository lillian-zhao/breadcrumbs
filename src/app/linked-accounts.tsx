import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Card, ListRow, PageHeader, Pill, Screen, SectionHeading, StatusMessage } from '@/components/ui';
import { linkedAccounts } from '@/data';
import { colors, fonts } from '@/theme';

export default function LinkedAccounts() {
  const [accounts, setAccounts] = useState(linkedAccounts);
  const [confirmGoogle, setConfirmGoogle] = useState(true);

  const google = accounts.find((account) => account.id === 'google');

  const toggle = (id: string) => {
    if (id === 'google' && google?.connected) {
      setConfirmGoogle(true);
      return;
    }
    setAccounts((current) =>
      current.map((account) => (account.id === id ? { ...account, connected: !account.connected } : account)),
    );
  };

  const disconnectGoogle = () => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === 'google' ? { ...account, connected: false, subtitle: 'Not connected' } : account,
      ),
    );
    setConfirmGoogle(false);
  };

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: 'Settings' }}
        title={{ title: 'Linked accounts', fontSize: 44, lineHeight: 49.28 }}
        subtitle="Your connections, on your terms"
        style={styles.header}
      />

      <View style={styles.content}>
        <StatusMessage
          icon={require('@assets/icons/info.svg')}
          title="You’re in control"
          body="Connecting an account never posts a crumb automatically. Each provider asks for your consent outside Crumbs."
        />

        <SectionHeading label="connected services" fontSize={19} ruleOpacity={0.6} />
        {accounts.map((account) => (
          <ListRow
            key={account.id}
            title={account.name}
            subtitle={account.subtitle}
            icon={account.id === 'instagram' ? require('@assets/icons/instagram.svg') : undefined}
            actionLabel={account.connected ? 'Disconnect' : 'Connect ↗'}
            onAction={() => toggle(account.id)}
          />
        ))}

        {confirmGoogle && google?.connected && (
          <Card>
            <Pill label="Google · Confirmation" />
            <Text style={styles.prompt}>Disconnect Google?</Text>
            <Text style={styles.body}>
              You’ll stop using Google to sign in. Make sure you can sign in with your email before disconnecting.
            </Text>
            <View style={styles.actions}>
              <Button label="Keep linked" variant="secondary" fill onPress={() => setConfirmGoogle(false)} />
              <Button label="Disconnect" fill onPress={disconnectGoogle} />
            </View>
          </Card>
        )}

        <SectionHeading label="sharing with linked apps" fontSize={19} ruleOpacity={0.6} />
        <ListRow
          icon={require('@assets/icons/lock.svg')}
          iconTint={colors.ink}
          title="Third-party integrations"
          subtitle="Off · No crumb data shared with linked apps"
          actionLabel="Off"
        />

        <Caption>
          Connect opens the provider’s secure sign-in page. You can review requested permissions before continuing. Cancel
          there returns here without connecting.
        </Caption>
        <Caption>Disconnecting won’t delete photos or crumbs already saved in your account.</Caption>
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
  prompt: {
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
