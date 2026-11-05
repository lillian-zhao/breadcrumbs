import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { layout } from '@/theme';

/** Top padding for a screen whose Figma frame places content `offset` px below the status bar. */
export function useScreenTop(offset = 0) {
  const insets = useSafeAreaInsets();
  return Math.max(insets.top, layout.statusBarHeight) + offset;
}
