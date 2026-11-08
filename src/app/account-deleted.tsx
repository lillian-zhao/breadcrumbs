import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Screen, TitleRow } from '@/components/ui';
import { colors, fonts } from '@/theme';

export default function AccountDeleted() {
  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <View style={styles.header}>
        <TitleRow title="All gone." fontSize={44} lineHeight={49.28} />
        <Text style={styles.subtitle}>This device no longer has a Breadcrumbs account.</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.headline}>Your crumbs aren’t here anymore.</Text>
        <Caption>
          Days, photos and saved spots from that account were removed. Friends keep the memories they logged themselves.
        </Caption>
        <Caption>
          If you make a new account later, it starts empty — this one can’t be restored.
        </Caption>
        <Button label="Back to sign in" onPress={() => router.replace('/sign-in' as Href)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 20,
    paddingBottom: 24,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18.85,
    color: colors.bark,
  },
  content: {
    gap: 22,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 37.76,
    color: colors.ink,
  },
});
