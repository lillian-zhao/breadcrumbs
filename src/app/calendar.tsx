import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { toDayParam } from '@/components/calendar';
import { YearCalendar } from '@/components/YearCalendar';
import { Caption, IconButton, PageHeader, Pill, Screen } from '@/components/ui';
import { countLoggedDays, currentUser, getPerson, getShadedDaysByMonth, today } from '@/data';

export default function CalendarYear() {
  const { friend: friendParam } = useLocalSearchParams<{ friend?: string }>();
  const friendId = Array.isArray(friendParam) ? friendParam[0] : friendParam;
  const friend = friendId ? getPerson(friendId) : undefined;
  const personId = friend?.id ?? currentUser.id;
  const [year, setYear] = useState(today.getFullYear());
  const shadedDaysByMonth = getShadedDaysByMonth(personId, year);
  const logged = countLoggedDays(personId, year);
  const years = [year - 1, year, year + 1];

  const openMonth = () => {
    if (friend) router.replace(`/friend/${friend.id}` as Href);
    else router.replace('/profile' as Href);
  };

  const openDay = (date: Date) => {
    const stamp = toDayParam(date);
    if (friend) router.push(`/journal/${friend.id}?date=${stamp}` as Href);
    else router.push(`/log-day?date=${stamp}` as Href);
  };

  return (
    <Screen edge="safeArea" topOffset={24} paddingHorizontal={24} withTabBar={false}>
      <PageHeader
        back={{ label: friend ? friend.name : 'Profile' }}
        title={{ title: `${year}`, fontSize: 44, lineHeight: 49.28 }}
        subtitle={
          friend
            ? `${logged} shared days · ${friend.name}’s year`
            : `${logged} days logged · ${currentUser.name}’s year`
        }
        style={styles.header}
      />

      <View style={styles.content}>
        <View style={styles.row}>
          <IconButton
            icon={require('@assets/icons/chevron-left.svg')}
            accessibilityLabel="Previous year"
            onPress={() => setYear((value) => value - 1)}
          />
          <View style={styles.years}>
            {years.map((value) => (
              <Pill
                key={value}
                label={String(value)}
                tone={value === year ? 'selected' : 'default'}
                onPress={() => setYear(value)}
              />
            ))}
          </View>
          <IconButton
            icon={require('@assets/icons/chevron-right.svg')}
            accessibilityLabel="Next year"
            onPress={() => setYear((value) => value + 1)}
          />
        </View>

        <View style={styles.viewToggle}>
          <Pill label="Month" onPress={openMonth} />
          <Pill label="Year" tone="selected" />
        </View>

        <YearCalendar
          year={year}
          today={year === today.getFullYear() ? today : undefined}
          shadedDaysByMonth={shadedDaysByMonth}
          onSelectMonth={openMonth}
          onSelectDay={openDay}
        />

        <Caption>
          {friend
            ? `Shaded days are crumbs ${friend.name} chose to share. Open a month for the full calendar, or a day for that journal.`
            : 'Shaded days are days you logged. Open a month for the full calendar, or a day to add to that journal.'}
        </Caption>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  content: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  years: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
  },
});
