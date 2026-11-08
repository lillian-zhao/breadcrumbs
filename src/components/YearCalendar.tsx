import { Pressable, StyleSheet, Text, View } from 'react-native';

import { buildWeeks, isSameDay, monthNames, weekdayLetters } from '@/components/calendar';
import { colors, fonts, radii } from '@/theme';

type Props = {
  year: number;
  today?: Date;
  shadedDaysByMonth: Partial<Record<number, number[]>>;
  onSelectMonth?: (month: number) => void;
  onSelectDay?: (date: Date) => void;
};

function MiniMonth({
  year,
  month,
  today,
  shadedDays,
  onSelectMonth,
  onSelectDay,
}: {
  year: number;
  month: number;
  today?: Date;
  shadedDays: number[];
  onSelectMonth?: (month: number) => void;
  onSelectDay?: (date: Date) => void;
}) {
  const weeks = buildWeeks(year, month);

  return (
    <View style={styles.month}>
      <Pressable
        onPress={() => onSelectMonth?.(month)}
        accessibilityRole="button"
        accessibilityLabel={monthNames[month]}
      >
        <Text style={styles.monthName}>{monthNames[month]}</Text>
      </Pressable>
      <View style={styles.weekdays}>
        {weekdayLetters.map((letter, column) => (
          <Text key={`${letter}-${column}`} style={styles.weekday}>
            {letter}
          </Text>
        ))}
      </View>
      {weeks.map((week, row) => (
        <View key={row} style={styles.week}>
          {week.map((day, column) => {
            const isToday = today !== undefined && isSameDay(day.date, today);
            const isShaded = day.inMonth && shadedDays.includes(day.date.getDate());

            return (
              <Pressable
                key={column}
                onPress={() => {
                  if (day.inMonth) onSelectDay?.(day.date);
                  else onSelectMonth?.(month);
                }}
                style={[styles.dayCell, isShaded && styles.shaded, isToday && styles.todayCell]}
                accessibilityRole="button"
                accessibilityLabel={day.inMonth ? day.date.toDateString() : undefined}
              >
                <Text style={[styles.day, !day.inMonth && styles.outsideDay, isToday && styles.today]}>
                  {day.date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/** Compact 12-month year grid used by your calendar and a friend’s shared calendar. */
export function YearCalendar({ year, today, shadedDaysByMonth, onSelectMonth, onSelectDay }: Props) {
  return (
    <View style={styles.year}>
      {Array.from({ length: 6 }, (_, pair) => (
        <View key={pair} style={styles.pair}>
          {[pair * 2, pair * 2 + 1].map((month) => (
            <MiniMonth
              key={month}
              year={year}
              month={month}
              today={today}
              shadedDays={shadedDaysByMonth[month] ?? []}
              onSelectMonth={onSelectMonth}
              onSelectDay={onSelectDay}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  year: {
    gap: 12,
  },
  pair: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  month: {
    width: 171,
    padding: 6,
    borderRadius: radii.control,
    backgroundColor: colors.cream,
  },
  monthName: {
    fontFamily: fonts.display,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
  weekdays: {
    marginTop: 5,
    flexDirection: 'row',
  },
  weekday: {
    width: 22.7,
    fontFamily: fonts.bodyBold,
    fontSize: 8,
    lineHeight: 11,
    color: colors.bark,
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    height: 20,
  },
  dayCell: {
    width: 22.7,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  shaded: {
    backgroundColor: colors.toastWash,
  },
  todayCell: {
    backgroundColor: colors.crumb,
  },
  day: {
    fontFamily: fonts.body,
    fontSize: 9,
    color: colors.ink,
  },
  outsideDay: {
    color: colors.toast,
  },
  today: {
    fontFamily: fonts.bodyBold,
    color: colors.white,
  },
});
