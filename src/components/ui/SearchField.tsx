import { Image } from 'expo-image';
import { Pressable, StyleSheet, TextInput, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onSubmit?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function SearchField({ value, onChangeText, placeholder, onSubmit, style }: Props) {
  return (
    <View style={[styles.field, style]}>
      <Image source={require('@assets/icons/search.svg')} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear search">
          <Image source={require('@assets/icons/close.svg')} style={styles.clear} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.sand,
    borderRadius: 21,
  },
  icon: {
    width: 18,
    height: 18,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.ink,
  },
  clear: {
    width: 16,
    height: 16,
  },
});
