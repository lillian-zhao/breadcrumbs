import { Geom_400Regular, Geom_500Medium, Geom_600SemiBold, Geom_700Bold } from '@expo-google-fonts/geom';
import { Gloock_400Regular } from '@expo-google-fonts/gloock';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }} />
    </>
  );
}
