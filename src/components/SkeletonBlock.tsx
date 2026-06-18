import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radii } from '../theme/tokens';

interface SkeletonBlockProps {
  height: number;
  width?: DimensionValue;
  style?: ViewStyle;
}

export function SkeletonBlock({ height, width = '100%', style }: SkeletonBlockProps) {
  return <View style={[styles.block, { height, width }, style]} />;
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: colors.line,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
});
