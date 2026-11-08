import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { MonthCalendar } from '@/components/MonthCalendar';
import { IconButton, SegmentedControl } from '@/components/ui';
import { currentUser } from '@/data';
import { colors, fonts } from '@/theme';

type CalendarScale = 'month' | 'year';

type Props = {
  personId: string;
  year: number;
  month: number;
  today: Date;
  shadedDays: number[];
  onShiftMonth: (delta: number) => void;
  onSelectDay?: (date: Date) => void;
};

/** Month calendar plus the Month/Year control used on your profile and a friend’s. */
export function ProfileCalendar({ personId, year, month, today, shadedDays, onShiftMonth, onSelectDay }: Props) {
  const openYear = () => {
    const href = personId === currentUser.id ? '/calendar' : `/calendar?friend=${personId}`;
    router.push(href as Href);
  };

  return (
    <View>
      <Text style={styles.title}>Calendar</Text>
      <View style={styles.nav}>
        <IconButton
          icon={require('@assets/icons/chevron-left.svg')}
          accessibilityLabel="Previous month"
          onPress={() => onShiftMonth(-1)}
        />
        <SegmentedControl
          variant="boxed"
          segments={[
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          value={'month' satisfies CalendarScale}
          onChange={(value) => {
            if (value === 'year') openYear();
          }}
        />
        <IconButton
          icon={require('@assets/icons/chevron-right.svg')}
          accessibilityLabel="Next month"
          onPress={() => onShiftMonth(1)}
        />
      </View>
      <MonthCalendar year={year} month={month} today={today} shadedDays={shadedDays} onSelectDay={onSelectDay} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: 30,
    height: 30,
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.bark,
    textAlign: 'center',
  },
  nav: {
    marginTop: 8,
    marginBottom: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
