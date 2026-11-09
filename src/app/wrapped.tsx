import { router, useLocalSearchParams, type Href } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { formatLoggedDay, toDayParam } from '@/components/calendar';
import { DayMap } from '@/components/DayMap';
import { Button, Caption, Card, ListRow, PageHeader, Photo, Pill, Screen, SectionHeading } from '@/components/ui';
import { emptyPhoto, useCurrentUser, useWeeklyCrumbs } from '@/data';
import type { WeeklyCrumb } from '@/data';
import { colors, fonts, radii } from '@/theme';

const collageHeights = [156, 108, 108, 156] as const;

function dateFromKey(key: string) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function weekLabel(now = new Date()) {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const sameMonth = start.getMonth() === end.getMonth();
  const monthStart = start.toLocaleDateString('en-US', { month: 'short' });
  const monthEnd = end.toLocaleDateString('en-US', { month: 'short' });
  return `${monthStart} ${start.getDate()} – ${sameMonth ? '' : `${monthEnd} `}${end.getDate()}, ${end.getFullYear()}`;
}

function groupByDay(crumbs: WeeklyCrumb[]) {
  const groups = new Map<string, WeeklyCrumb[]>();
  for (const crumb of crumbs) {
    const key = `${crumb.visitedAt.getFullYear()}-${String(crumb.visitedAt.getMonth() + 1).padStart(2, '0')}-${String(crumb.visitedAt.getDate()).padStart(2, '0')}`;
    groups.set(key, [...(groups.get(key) ?? []), crumb]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function WeeklyWrapped() {
  const { friend: friendParam } = useLocalSearchParams<{ friend?: string }>();
  const friendId = Array.isArray(friendParam) ? friendParam[0] : friendParam;
  const { data: currentUser } = useCurrentUser();
  const { data: crumbs = [], loading } = useWeeklyCrumbs(friendId);
  const groups = groupByDay(crumbs);
  const placeNames = new Set(crumbs.map((crumb) => crumb.placeName.trim().toLowerCase()));
  const mapCrumbs = crumbs.filter((crumb): crumb is WeeklyCrumb & { latitude: number; longitude: number } =>
    typeof crumb.latitude === 'number' && typeof crumb.longitude === 'number',
  );
  const heroPhotos = crumbs.flatMap((crumb) => crumb.photo ? [crumb.photo] : []).slice(0, 4);
  const title = friendId ? 'Their week.' : 'Your week.';

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: friendId ? 'Back' : 'Home' }}
        title={{ title, fontSize: 44, lineHeight: 49.28 }}
        subtitle={`${friendId ? 'A shared recap' : 'A little look back'} · ${weekLabel()}`}
        style={styles.header}
      />

      <View style={styles.content}>
        <Pill label={loading ? 'Gathering this week’s crumbs' : `${crumbs.length} crumb${crumbs.length === 1 ? '' : 's'} this week`} />

        <View style={styles.collage} accessibilityLabel="Images attached to this week's crumbs">
          {[0, 1].map((column) => (
            <View key={column} style={styles.strip}>
              {[column, column + 2].map((index) => (
                <Photo key={index} photo={heroPhotos[index] ?? emptyPhoto} style={{ height: collageHeights[index] }} />
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.headline}>The ordinary, remembered.</Text>

        <Card>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{crumbs.length}</Text>
              <Text style={styles.metricLabel}>crumbs</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{placeNames.size}</Text>
              <Text style={styles.metricLabel}>places</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{groups.length}</Text>
              <Text style={styles.metricLabel}>days kept</Text>
            </View>
          </View>
        </Card>

        <SectionHeading label="crumbs from your week" fontSize={19} ruleOpacity={0.6} />
        {groups.length === 0 ? (
          <Card><Caption>{loading ? 'Loading your crumbs…' : 'No crumbs logged this week yet.'}</Caption></Card>
        ) : groups.map(([key, dayCrumbs]) => (
          <ListRow
            key={key}
            title={dayCrumbs.map((crumb) => crumb.placeName).join(' · ')}
            subtitle={`${formatLoggedDay(dateFromKey(key))} · ${dayCrumbs.length} crumb${dayCrumbs.length === 1 ? '' : 's'}`}
            actionLabel="View day"
            onAction={() => router.push((`/log-day?date=${toDayParam(dateFromKey(key))}`) as Href)}
          />
        ))}

        <SectionHeading label="places in your week" fontSize={19} ruleOpacity={0.6} />
        <View style={styles.map}>
          {Platform.OS === 'ios' || Platform.OS === 'android' ? (
            <DayMap variant="mine" crumbs={mapCrumbs} />
          ) : (
            <View style={styles.webMapFallback}>
              <Text style={styles.fallbackTitle}>PLACES THIS WEEK</Text>
              <Text style={styles.fallbackPlaces}>{mapCrumbs.map((crumb) => crumb.placeName).join(' · ') || 'No mapped crumbs this week'}</Text>
            </View>
          )}
        </View>
        {mapCrumbs.length !== crumbs.length && <Caption>Some crumbs don’t have map coordinates yet.</Caption>}

        <Button
          label="Share this wrapped"
          icon={require('@assets/icons/share.svg')}
          onPress={() => router.push((friendId ? `/share?friend=${friendId}` : '/share') as Href)}
        />
        <Button
          label={friendId ? 'Back' : 'Back to Home'}
          variant="secondary"
          onPress={() => (friendId ? router.back() : router.replace('/' as Href))}
        />
        {!friendId && <Caption align="center">{currentUser?.name ?? 'Your'} week · private until you choose to share.</Caption>}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  content: { gap: 22 },
  collage: { flexDirection: 'row', gap: 6 },
  strip: { flex: 1, gap: 6 },
  headline: { fontFamily: fonts.display, fontSize: 32, lineHeight: 37.76, color: colors.ink },
  metrics: { flexDirection: 'row', gap: 16 },
  metric: { flex: 1, gap: 4 },
  metricValue: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.ink },
  metricLabel: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17.4, color: colors.ink },
  map: { height: 230, overflow: 'hidden', borderRadius: radii.control, backgroundColor: colors.paper },
  webMapFallback: { flex: 1, justifyContent: 'center', gap: 12, padding: 20, borderRadius: radii.control, backgroundColor: colors.track },
  fallbackTitle: { fontFamily: fonts.body, fontSize: 10, color: colors.bark },
  fallbackPlaces: { fontFamily: fonts.display, fontSize: 18, lineHeight: 24, color: colors.ink },
});
