import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScreenTop } from '@/hooks/useScreenTop';
import { colors, layout } from '@/theme';

type Props = {
  children: ReactNode;
  /** Distance below the status bar where the Figma frame starts its content. */
  topOffset?: number;
  /** `statusBar` frames reserve the 62px iPhone status bar; `safeArea` frames start right at the inset. */
  edge?: 'statusBar' | 'safeArea';
  /** Leave room for the floating tab bar. */
  withTabBar?: boolean;
  paddingHorizontal?: number;
  contentWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  topOffset = 0,
  edge = 'statusBar',
  withTabBar = true,
  paddingHorizontal = 0,
  contentWidth,
  contentStyle,
}: Props) {
  const statusBarTop = useScreenTop(topOffset);
  const insets = useSafeAreaInsets();
  const paddingTop = edge === 'statusBar' ? statusBarTop : insets.top + topOffset;
  const paddingBottom = withTabBar ? layout.tabBarClearance : Math.max(insets.bottom, 28);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        { paddingTop, paddingBottom, paddingHorizontal },
        contentWidth !== undefined && { width: contentWidth, alignSelf: 'center' },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.paper,
  },
});
