import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, fonts, radii } from '@/theme';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  helper?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  autoCorrect?: boolean;
  textContentType?: TextInputProps['textContentType'];
  style?: StyleProp<ViewStyle>;
};

/** Labeled "Form field" with an optional helper line. */
export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  multiline = false,
  keyboardType,
  autoCapitalize,
  autoComplete,
  autoCorrect,
  textContentType,
  style,
}: Props) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        textContentType={textContentType}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={label}
      />
      {helper !== undefined && <Text style={styles.helper}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 7,
  },
  label: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.bark,
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: radii.card,
    backgroundColor: colors.cream,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21.7,
    color: colors.ink,
  },
  multiline: {
    minHeight: 96,
  },
  helper: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 18.6,
    color: colors.caption,
  },
});
