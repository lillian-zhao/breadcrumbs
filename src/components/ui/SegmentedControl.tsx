import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radii, shadows } from '@/theme';

export type Segment<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  segments: Segment<T>[];
  value: T;
  onChange?: (value: T) => void;
  /**
   * `pills` — separate rounded pills (Map view toggle).
   * `boxed` — bordered box with a filled segment (Calendar month/year).
   * `track` — sliding thumb on a tinted track (Settings tabs).
   */
  variant?: 'pills' | 'boxed' | 'track';
  /** `compact` pills are 34px high, raised, and fixed-width. */
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function SegmentedControl<T extends string>({
  segments,
  value,
  onChange,
  variant = 'pills',
  compact = false,
  style,
}: Props<T>) {
  const containerStyle =
    variant === 'pills' ? [styles.pills, compact && styles.pillsCompact] : variant === 'boxed' ? styles.boxed : styles.track;

  return (
    <View style={[containerStyle, style]} accessibilityRole="tablist">
      {segments.map((segment) => {
        const isSelected = segment.value === value;
        return (
          <Pressable
            key={segment.value}
            onPress={() => onChange?.(segment.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            style={segmentStyle(variant, compact, isSelected)}
          >
            <Text style={labelStyle(variant, compact, isSelected)}>{segment.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function segmentStyle(variant: Props<string>['variant'], compact: boolean, isSelected: boolean) {
  switch (variant) {
    case 'boxed':
      return [styles.boxedSegment, isSelected && { backgroundColor: colors.bark }];
    case 'track':
      return [styles.trackSegment, isSelected && styles.trackThumb];
    default:
      return [
        styles.pill,
        compact ? styles.pillCompact : styles.pillRegular,
        isSelected ? styles.pillSelected : compact ? styles.pillIdleCompact : styles.pillIdle,
      ];
  }
}

function labelStyle(variant: Props<string>['variant'], compact: boolean, isSelected: boolean) {
  switch (variant) {
    case 'boxed':
      return [styles.boxedLabel, { color: isSelected ? colors.white : colors.bark }];
    case 'track':
      return isSelected ? styles.trackLabelSelected : styles.trackLabel;
    default:
      return [styles.pillLabel, { fontSize: compact ? 13 : 15, color: isSelected ? colors.white : colors.bark }];
  }
}

const styles = StyleSheet.create({
  pills: {
    flexDirection: 'row',
    gap: 8,
  },
  pillsCompact: {
    gap: 20,
    paddingHorizontal: 5,
  },
  pill: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.pill,
  },
  pillRegular: {
    flex: 1,
    height: 40,
  },
  pillCompact: {
    width: 160,
    height: 34,
    boxShadow: shadows.raised,
  },
  pillSelected: {
    backgroundColor: colors.crumb,
  },
  pillIdle: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.sand,
  },
  pillIdleCompact: {
    backgroundColor: colors.cream,
  },
  pillLabel: {
    fontFamily: fonts.body,
  },
  boxed: {
    height: 44,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: colors.bark,
    borderRadius: radii.control,
    overflow: 'hidden',
  },
  boxedSegment: {
    width: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxedLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
  track: {
    height: 44,
    flexDirection: 'row',
    padding: 3,
    paddingHorizontal: 4,
    borderRadius: 22,
    backgroundColor: colors.track,
  },
  trackSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  trackThumb: {
    backgroundColor: colors.crumb,
  },
  trackLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.bark,
  },
  trackLabelSelected: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.ink,
  },
});
