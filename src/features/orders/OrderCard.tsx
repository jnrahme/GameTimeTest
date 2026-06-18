import { CalendarDays, ChevronRight, MapPin } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CachedImageBackground } from '../../components/CachedImageBackground';

import {
  formatEventDate,
  formatMoney,
  formatSeatSummary,
} from '../../domain/orders/formatters';
import { Order } from '../../domain/orders/types';
import {
  colors,
  radii,
  shadows,
  spacing,
  typography,
} from '../../theme/tokens';
import { StatusPill } from '../../components/StatusPill';

interface OrderCardProps {
  order: Order;
  onPress: (orderId: string) => void;
}

export function OrderCard({ order, onPress }: OrderCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Open receipt for ${order.event.name}`}
      accessibilityRole="button"
      onPress={() => onPress(order.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <CachedImageBackground
        accessibilityLabel={`${order.event.name} event image`}
        imageStyle={styles.image}
        uri={order.event.imageUrl}
        style={styles.imageFrame}
      >
        <LinearGradient
          colors={['rgba(23,20,18,0.1)', colors.scrim]}
          style={styles.gradient}
        />
        <View style={styles.imageContent}>
          <StatusPill status={order.status} />
          <Text numberOfLines={2} style={styles.eventName}>
            {order.event.name}
          </Text>
        </View>
      </CachedImageBackground>

      <View style={styles.details}>
        <View style={styles.metaRow}>
          <CalendarDays color={colors.accent} size={18} strokeWidth={2.2} />
          <Text style={styles.metaText}>
            {formatEventDate(order.event.datetime)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <MapPin color={colors.accent} size={18} strokeWidth={2.2} />
          <Text numberOfLines={1} style={styles.metaText}>
            {order.event.venue}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={styles.seatText}>
              {formatSeatSummary(order.seats)}
            </Text>
            <Text
              maxFontSizeMultiplier={typography.displayMaxScale}
              style={styles.totalText}
            >
              {formatMoney(order.receipt.total)}
            </Text>
          </View>
          <View style={styles.chevronFrame}>
            <ChevronRight color={colors.accent} size={20} strokeWidth={2.4} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  chevronFrame: {
    alignItems: 'center',
    backgroundColor: colors.surfaceWarm,
    borderRadius: radii.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  details: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  eventName: {
    color: colors.white,
    fontFamily: typography.family,
    fontSize: typography.sizes.section,
    fontWeight: '900',
    lineHeight: 30,
    maxWidth: 310,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.md,
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
  },
  footerText: {
    flex: 1,
    gap: spacing.xs,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    borderTopLeftRadius: radii.md,
    borderTopRightRadius: radii.md,
  },
  imageContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  imageFrame: {
    aspectRatio: 16 / 10,
    backgroundColor: colors.brandBlack,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 24,
  },
  metaText: {
    color: colors.subtle,
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 22,
  },
  pressed: {
    transform: [{ translateY: 1 }, { scale: 0.995 }],
  },
  seatText: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '600',
    lineHeight: 18,
  },
  totalText: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.title,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
});
