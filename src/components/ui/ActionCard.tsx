import { Image, type ImageSource } from 'expo-image';
import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, fonts, radii } from '@/theme';

type Props = {
  icon: ImageSource;
  title: string;
  subtitle: string;
  color: string;
  href?: Href;
};

/** The colored shortcut cards on Profile (“My Crumbs”, “Log a Day”). */
export function ActionCard({ icon, title, subtitle, color, href }: Props) {
  return (
    <Pressable
      style={[styles.card, { backgroundColor: color }]}
      onPress={href ? () => router.push(href) : undefined}
      accessibilityRole="button"
    >
      <Image source={icon} style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    height: 105,
    padding: 14,
    gap: 6,
    borderRadius: radii.control,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.paper,
  },
});
