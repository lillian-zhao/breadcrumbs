import { View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';

type Props = {
  tone?: 'sand' | 'toast';
  style?: StyleProp<ViewStyle>;
};

export function Divider({ tone = 'sand', style }: Props) {
  return <View style={[{ height: 1, backgroundColor: colors[tone] }, style]} />;
}
