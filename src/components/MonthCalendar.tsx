import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radii } from '@/theme';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const columnWidths = [50, 50, 50, 50, 50, 52, 52];

type Day = {
  date: Date;
  inMonth: boolean;
};

type Props = {
  year: number;
  month: number;
  today?: Date;
  shadedDays?: number[];
  onSelectDay?: (date: Date) => void;
};

function buildWeeks(year: number, month: number): Day[][] {
  const first = new Date(year, month, 1);
  const leading = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((leading + daysInMonth) / 7) * 7;

  const days = Array.from({ length: cellCount }, (_, index) => {
    const date = new Date(year, month, index - leading + 1);
    return { date, inMonth: date.getMonth() === month };
  });

  return Array.from({ length: cellCount / 7 }, (_, week) => days.slice(week * 7, week * 7 + 7));
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function MonthCalendar({ year, month, today, shadedDays = [], onSelectDay }: Props) {
  const weeks = buildWeeks(year, month);

  return (
    <View>
      <View style={styles.header}>
        {weekdays.map((weekday, column) => (
          <Text key={weekday} style={[styles.weekday, { width: columnWidths[column] }]}>
            {weekday}
          </Text>
        ))}
      </View>

      {weeks.map((week, row) => (
        <View key={row} style={[styles.week, row < weeks.length - 1 && styles.weekRule]}>
          {week.map((day, column) => {
            const isToday = today !== undefined && isSameDay(day.date, today);
            const isShaded = day.inMonth && shadedDays.includes(day.date.getDate());

            return (
              <Pressable
                key={column}
                onPress={() => onSelectDay?.(day.date)}
                style={[styles.cell, { width: columnWidths[column] }, isShaded && styles.shaded]}
                accessibilityRole="button"
                accessibilityLabel={day.date.toDateString()}
                accessibilityState={{ selected: isToday }}
              >
                {isToday && <View style={styles.todayMarker} />}
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: 36,
    borderBottomWidth: 1,
    borderBottomColor: colors.toast,
  },
  weekday: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.bark,
    textAlign: 'center',
  },
  week: {
    flexDirection: 'row',
    height: 48,
  },
  weekRule: {
    borderBottomWidth: 1,
    borderBottomColor: colors.toastLine,
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shaded: {
    backgroundColor: colors.toastWash,
  },
  todayMarker: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 40,
    borderRadius: radii.card,
    backgroundColor: colors.crumb,
  },
  day: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  outsideDay: {
    color: colors.toast,
  },
  today: {
    fontFamily: fonts.bodyBold,
  },
});
