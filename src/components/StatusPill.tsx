import { CheckCircle2, Clock3, RotateCcw, XCircle } from 'lucide-react-native';
import { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getStatusLabel } from '../domain/orders/formatters';
import { OrderStatus } from '../domain/orders/types';
import { colors, radii, spacing, typography } from '../theme/tokens';

interface StatusPillProps {
  status: OrderStatus;
}

const statusStyles: Record<
  OrderStatus,
  { backgroundColor: string; color: string; Icon: ComponentType<any> }
> = {
  placed: {
    backgroundColor: 'rgba(102, 250, 200, 0.14)',
    color: colors.accent,
    Icon: Clock3,
  },
  confirmed: {
    backgroundColor: 'rgba(102, 250, 200, 0.14)',
    color: colors.accent,
    Icon: CheckCircle2,
  },
  completed: {
    backgroundColor: 'rgba(102, 250, 200, 0.14)',
    color: colors.success,
    Icon: CheckCircle2,
  },
  cancelled: {
    backgroundColor: 'rgba(255, 90, 107, 0.16)',
    color: colors.danger,
    Icon: XCircle,
  },
  refunded: {
    backgroundColor: 'rgba(196, 199, 207, 0.14)',
    color: colors.subtle,
    Icon: RotateCcw,
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const treatment = statusStyles[status];
  const Icon = treatment.Icon;

  return (
    <View
      accessibilityLabel={`Order status ${getStatusLabel(status)}`}
      style={[styles.pill, { backgroundColor: treatment.backgroundColor }]}
    >
      <Icon color={treatment.color} size={14} strokeWidth={2.4} />
      <Text style={[styles.label, { color: treatment.color }]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '700',
  },
  pill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radii.round,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 28,
    paddingHorizontal: spacing.md,
  },
});
