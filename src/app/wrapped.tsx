import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Caption, Card, ListRow, PageHeader, Photo, Pill, Screen, SectionHeading } from '@/components/ui';
import { currentUser, friendWeeks, getPerson, weeklyHighlights, weeklyWrapped } from '@/data';
import { colors, fonts, mapColors, radii } from '@/theme';

const collageHeights = [156, 108, 108, 156] as const;

export default function WeeklyWrapped() {
  const { friend: friendParam } = useLocalSearchParams<{ friend?: string }>();
  const friendId = Array.isArray(friendParam) ? friendParam[0] : friendParam;
  const friend = friendId ? getPerson(friendId) : undefined;
  const week = friend ? friendWeeks.find((item) => item.friendId === friend.id) : undefined;
  const title = friend ? `${friend.name}’s week.` : 'Your week.';
  const spots = week?.places ?? 6;
  const discoveries = week?.newPlaces ?? 2;

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: friend ? 'Back' : 'Home' }}
        title={{ title, fontSize: 44, lineHeight: 49.28 }}
        subtitle={friend ? `${friend.name} · A shared recap` : 'A little look back · Sep 28 – Oct 4, 2026'}
        style={styles.header}
      />

      <View style={styles.content}>
        <Pill label="Sample recap · illustrative totals" />

        <View style={styles.collage}>
          <View style={styles.strip}>
            <Photo photo={weeklyWrapped[0]} style={{ height: collageHeights[0] }} />
            <Photo photo={weeklyWrapped[2]} style={{ height: collageHeights[2] }} />
          </View>
          <View style={styles.strip}>
            <Photo photo={weeklyWrapped[1]} style={{ height: collageHeights[1] }} />
            <Photo photo={weeklyWrapped[3]} style={{ height: collageHeights[3] }} />
          </View>
        </View>

        <Text style={styles.headline}>The ordinary, remembered.</Text>

        <Card>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{spots}</Text>
              <Text style={styles.metricLabel}>visited spots</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{discoveries}</Text>
              <Text style={styles.metricLabel}>new discoveries</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>4</Text>
              <Text style={styles.metricLabel}>days kept</Text>
            </View>
          </View>
        </Card>

        <SectionHeading label="day highlights" fontSize={19} ruleOpacity={0.6} />
        {weeklyHighlights.map((highlight) => (
          <ListRow
            key={highlight.title}
            title={highlight.title}
            subtitle={highlight.subtitle}
            actionLabel={highlight.actionLabel}
            onAction={() => router.push(highlight.href as Href)}
          />
        ))}

        <SectionHeading label="places in your week" fontSize={19} ruleOpacity={0.6} />
        <View style={styles.map} accessibilityLabel="Pittsburgh places from this week">
          <Text style={styles.mapCity}>PITTSBURGH</Text>
          <View style={[styles.block, { left: 0, top: 0, width: 110, height: 80 }]} />
          <View style={[styles.block, { left: 124, top: 0, width: 110, height: 80 }]} />
          <View style={[styles.block, { left: 248, top: 0, width: 110, height: 80 }]} />
          <View style={[styles.park, { left: 0, top: 94, width: 110, height: 96 }]} />
          <View style={[styles.block, { left: 124, top: 94, width: 110, height: 96 }]} />
          <View style={[styles.block, { left: 248, top: 94, width: 110, height: 96 }]} />
          <View style={styles.trail} />
          <View style={[styles.mapLabel, { left: 26, top: 50 }]}>
            <Text style={styles.mapLabelText}>Cafe</Text>
          </View>
          <View style={[styles.mapLabel, { left: 196, top: 126 }]}>
            <Text style={styles.mapLabelText}>Morning walk</Text>
          </View>
        </View>
        <Caption>
          An illustrative summary of your places, not a live location trail. Your full days stay in your journal.
        </Caption>

        <Button
          label="Share this wrapped"
          icon={require('@assets/icons/share.svg')}
          onPress={() => router.push((friend ? `/share?friend=${friend.id}` : '/share') as Href)}
        />
        <Button
          label={friend ? `Back to ${friend.name}` : 'Back to Home'}
          variant="secondary"
          onPress={() => (friend ? router.back() : router.replace('/' as Href))}
        />
        {!friend && (
          <Caption align="center">
            {currentUser.name}’s week · private until you choose to share.
          </Caption>
        )}
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
  collage: {
    flexDirection: 'row',
    gap: 6,
  },
  strip: {
    flex: 1,
    gap: 6,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 37.76,
    color: colors.ink,
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    flex: 1,
    gap: 4,
  },
  metricValue: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
    color: colors.ink,
  },
  metricLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17.4,
    color: colors.ink,
  },
  map: {
    height: 190,
    overflow: 'hidden',
    borderRadius: radii.control,
    backgroundColor: mapColors.street,
  },
  mapCity: {
    position: 'absolute',
    left: 14,
    top: 14,
    zIndex: 2,
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.bark,
  },
  block: {
    position: 'absolute',
    backgroundColor: mapColors.block,
  },
  park: {
    position: 'absolute',
    backgroundColor: mapColors.park,
  },
  trail: {
    position: 'absolute',
    left: 70,
    top: 70,
    width: 160,
    height: 70,
    borderWidth: 2,
    borderColor: colors.crumb,
    borderStyle: 'dashed',
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  mapLabel: {
    position: 'absolute',
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.cream,
  },
  mapLabelText: {
    fontFamily: fonts.display,
    fontSize: 13,
    color: colors.ink,
  },
});
