import { router, useLocalSearchParams, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { formatLoggedDay, parseDayParam, toDayParam } from '@/components/calendar';
import { Button, Caption, Card, ListRow, PageHeader, Photo, Screen, SectionHeading } from '@/components/ui';
import { useCurrentUser, useDayLog } from '@/data';
import type { Stop } from '@/data';
import { colors, fonts } from '@/theme';

function stopDetail(stop: Stop) {
  const parts = [stop.time, stop.city];
  if (stop.photoCount > 0) parts.push(stop.photoCount + ' photo' + (stop.photoCount === 1 ? '' : 's'));
  return parts.join(' · ');
}

export default function LogDay() {
  const { date: dateParam } = useLocalSearchParams<{ date?: string }>();
  const date = parseDayParam(dateParam) ?? new Date();
  const { data: currentUser } = useCurrentUser();
  const { data: dayLog, loading } = useDayLog(date);
  const stops = dayLog?.stops ?? [];
  const dayLabel = formatLoggedDay(date);
  const addCrumb = () => router.push(('/add-crumb?date=' + toDayParam(date)) as Href);

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: dateParam ? 'Calendar' : 'Home' }}
        title={{ title: 'Today’s crumbs', fontSize: 44, lineHeight: 49.28 }}
        subtitle={(currentUser?.name ?? 'You') + ' · ' + dayLabel}
        style={styles.header}
      />

      <View style={styles.content}>
        <Button label="Add crumb" icon={require('@assets/icons/plus.svg')} onPress={addCrumb} />

        <ListRow
          icon={require('@assets/icons/calendar-row.svg')}
          title={dayLabel}
          subtitle={loading ? 'Loading crumbs…' : `${stops.length} crumb${stops.length === 1 ? '' : 's'}`}
        />

        {dayLog?.note ? (
          <Card>
            <Caption>Note for this day</Caption>
            <Text style={styles.note}>{dayLog.note}</Text>
          </Card>
        ) : null}

        <SectionHeading label="crumbs" fontSize={19} ruleOpacity={0.6} />
        {stops.length === 0 ? (
          <Card>
            <Caption>{loading ? 'Loading…' : 'No crumbs for this day yet. Add one to get started.'}</Caption>
          </Card>
        ) : (
          stops.map((stop) => (
            <Card key={stop.id}>
              {stop.photo ? <Photo photo={stop.photo} style={styles.photo} /> : null}
              <ListRow
                icon={require('@assets/icons/map-pin-row.svg')}
                title={stop.name}
                subtitle={stopDetail(stop)}
              />
            </Card>
          ))
        )}

      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 24 },
  content: { gap: 20 },
  note: { fontFamily: fonts.display, fontSize: 20, lineHeight: 25, color: colors.ink },
  photo: { height: 180, marginBottom: 12 },
});
