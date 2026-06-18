import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '../theme/tokens';

interface ReceiptRowProps {
  label: string;
  value: string;
  emphasized?: boolean;
}

export function ReceiptRow({ label, value, emphasized = false }: ReceiptRowProps) {
  return (
    <View style={[styles.row, emphasized && styles.emphasizedRow]}>
      <Text style={[styles.label, emphasized && styles.emphasizedText]}>
        {label}
      </Text>
      <Text style={[styles.value, emphasized && styles.emphasizedText]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emphasizedRow: {
    borderTopColor: colors.line,
    borderTopWidth: 1,
    marginTop: spacing.sm,
    paddingTop: spacing.lg,
  },
  emphasizedText: {
    color: colors.ink,
    fontSize: typography.sizes.title,
    fontWeight: '800',
  },
  label: {
    color: colors.muted,
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 22,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.lg,
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  value: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
    lineHeight: 22,
    textAlign: 'right',
  },
});
