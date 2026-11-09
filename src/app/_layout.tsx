import { Geom_400Regular, Geom_500Medium, Geom_600SemiBold, Geom_700Bold } from '@expo-google-fonts/geom';
import { Gloock_400Regular } from '@expo-google-fonts/gloock';
import { useFonts } from 'expo-font';
import { Stack, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ConnectionsProvider } from '@/connections';
import { SessionProvider, useSession } from '@/session';
import { colors } from '@/theme';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Gloock_400Regular,
    Geom_400Regular,
    Geom_500Medium,
    Geom_600SemiBold,
    Geom_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <SessionProvider>
      <ConnectionsProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </ConnectionsProvider>
    </SessionProvider>
  );
}

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
      <Stack.Protected guard={!!session} redirectTo={'/sign-in' as Href}>
        <Stack.Screen name="add-crumb" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="blocked" />
        <Stack.Screen name="calendar" />
        <Stack.Screen name="choose-location" />
        <Stack.Screen name="crumb/[id]" />
        <Stack.Screen name="delete-account" />
        <Stack.Screen name="edit-location" />
        <Stack.Screen name="edit-photo" />
        <Stack.Screen name="edit-profile" />
        <Stack.Screen name="friend-places/[id]" />
        <Stack.Screen name="friend/[id]" />
        <Stack.Screen name="journal/[id]" />
        <Stack.Screen name="linked-accounts" />
        <Stack.Screen name="log-day" />
        <Stack.Screen name="map-day/[id]" />
        <Stack.Screen name="people" />
        <Stack.Screen name="place/[id]" />
        <Stack.Screen name="recommend" />
        <Stack.Screen name="saved-spots" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="share" />
        <Stack.Screen name="sign-out" />
        <Stack.Screen name="visibility" />
        <Stack.Screen name="wrapped" />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
      <Stack.Screen name="account-deleted" />
    </Stack>
  );
}
