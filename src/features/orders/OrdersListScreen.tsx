import { Search, Sparkles } from 'lucide-react-native';
import {
  ActivityIndicator,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ActionButton } from '../../components/ActionButton';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { formatMoney } from '../../domain/orders/formatters';
import { OrderFilter, Order } from '../../domain/orders/types';
import { OrderSummary } from '../../domain/orders/selectors';
import { colors, radii, shadows, spacing, typography } from '../../theme/tokens';
import { OrderCard } from './OrderCard';

interface OrdersListScreenProps {
  orders: Order[];
  query: string;
  filter: OrderFilter;
  summary: OrderSummary;
  isLoading: boolean;
  error?: string;
  onQueryChange: (query: string) => void;
  onFilterChange: (filter: OrderFilter) => void;
  onSelectOrder: (orderId: string) => void;
  onRetry: () => void;
}

const filters: Array<{ label: string; value: OrderFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
];

export function OrdersListScreen({
  orders,
  query,
  filter,
  summary,
  isLoading,
  error,
  onQueryChange,
  onFilterChange,
  onSelectOrder,
  onRetry,
}: OrdersListScreenProps) {
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const isWide = width >= 760;
  const heroImageUrl =
    orders[0]?.event.imageUrl ??
    'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85';

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      style={styles.scroll}
    >
      <View style={[styles.shell, isWide && styles.shellWide]}>
        <ImageBackground
          accessibilityIgnoresInvertColors
          imageStyle={styles.heroImage}
          source={{ uri: heroImageUrl }}
          style={[styles.hero, isLandscape && styles.heroLandscape]}
        >
          <LinearGradient
            colors={['rgba(23,20,18,0.34)', 'rgba(23,20,18,0.9)']}
            style={styles.heroGradient}
          />
          <View
            style={[styles.heroInner, isLandscape && styles.heroInnerLandscape]}
          >
            <View
              style={[styles.heroCopy, isLandscape && styles.heroCopyLandscape]}
            >
              <View style={styles.eyebrow}>
                <Sparkles color={colors.gold} size={16} strokeWidth={2.2} />
                <Text style={styles.eyebrowText}>GameTime purchase history</Text>
              </View>
              <Text
                style={[styles.heroTitle, isLandscape && styles.heroTitleLandscape]}
              >
                Your nights out, accounted for.
              </Text>
              <Text style={[styles.heroBody, isLandscape && styles.heroBodyLandscape]}>
                Review every ticket, receipt, seat, and share-ready calendar
                invite from one fast order timeline.
              </Text>
            </View>

            <View
              style={[
                styles.summaryGrid,
                isLandscape && styles.summaryGridLandscape,
              ]}
            >
              <SummaryMetric label="Orders" value={`${summary.totalOrders}`} />
              <SummaryMetric label="Upcoming" value={`${summary.upcomingOrders}`} />
              <SummaryMetric
                label="Total spent"
                value={formatMoney(summary.totalSpent)}
              />
            </View>
          </View>
        </ImageBackground>

        <View style={styles.toolbar}>
          <View style={styles.searchBox}>
            <Search color={colors.muted} size={19} strokeWidth={2.2} />
            <TextInput
              accessibilityLabel="Search orders"
              autoCorrect={false}
              onChangeText={onQueryChange}
              placeholder="Search by event, venue, or confirmation"
              placeholderTextColor={colors.subtle}
              returnKeyType="search"
              style={styles.searchInput}
              value={query}
            />
          </View>

          <View accessibilityRole="tablist" style={styles.segmentedControl}>
            {filters.map((item) => {
              const selected = item.value === filter;
              return (
                <Pressable
                  accessibilityRole="tab"
                  accessibilityState={{ selected }}
                  key={item.value}
                  onPress={() => onFilterChange(item.value)}
                  style={[styles.segment, selected && styles.segmentSelected]}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      selected && styles.segmentTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {error ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>Orders could not load</Text>
            <Text style={styles.stateBody}>{error}</Text>
            <ActionButton title="Retry" onPress={onRetry} />
          </View>
        ) : null}

        {isLoading ? <OrdersLoadingState /> : null}

        {!isLoading && !error && orders.length === 0 ? (
          <View style={styles.statePanel}>
            <Text style={styles.stateTitle}>No orders match this view</Text>
            <Text style={styles.stateBody}>
              Try a different search or switch filters to see more purchases.
            </Text>
          </View>
        ) : null}

        {!isLoading && !error && orders.length > 0 ? (
          <View style={[styles.orderGrid, isWide && styles.orderGridWide]}>
            {orders.map((order) => (
              <View
                key={order.id}
                style={[styles.orderCell, isWide && styles.orderCellWide]}
              >
                <OrderCard order={order} onPress={onSelectOrder} />
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function OrdersLoadingState() {
  return (
    <View style={styles.loadingPanel}>
      <ActivityIndicator color={colors.coralDark} />
      <SkeletonBlock height={220} />
      <SkeletonBlock height={220} />
    </View>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  eyebrowText: {
    color: colors.gold,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  hero: {
    backgroundColor: colors.brandBlack,
    borderRadius: radii.md,
    minHeight: 360,
    overflow: 'hidden',
    ...shadows.raised,
  },
  heroBody: {
    color: colors.subtle,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    maxWidth: 640,
  },
  heroCopy: {
    gap: spacing.md,
  },
  heroCopyLandscape: {
    flex: 1,
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  heroImage: {
    borderRadius: radii.md,
  },
  heroLandscape: {
    minHeight: 260,
  },
  heroInner: {
    flex: 1,
    gap: spacing.xl,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  heroInnerLandscape: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 260,
    padding: spacing.lg,
  },
  heroTitle: {
    color: colors.white,
    fontFamily: typography.family,
    fontSize: typography.sizes.hero,
    fontWeight: '900',
    lineHeight: 42,
    maxWidth: 650,
  },
  heroTitleLandscape: {
    fontSize: 30,
    lineHeight: 35,
    maxWidth: 430,
  },
  heroBodyLandscape: {
    maxWidth: 450,
  },
  loadingPanel: {
    gap: spacing.lg,
  },
  metric: {
    backgroundColor: 'rgba(28, 28, 32, 0.78)',
    borderColor: 'rgba(255,255,255,0.16)',
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    minWidth: 130,
    padding: spacing.lg,
  },
  metricLabel: {
    color: colors.subtle,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  metricValue: {
    color: colors.white,
    fontFamily: typography.family,
    fontSize: typography.sizes.title,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  orderGrid: {
    gap: spacing.lg,
  },
  orderGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  orderCell: {
    width: '100%',
  },
  orderCellWide: {
    flexBasis: '48%',
    flexGrow: 1,
  },
  scroll: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: 52,
    minWidth: 260,
    paddingHorizontal: spacing.lg,
  },
  searchInput: {
    color: colors.ink,
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    minHeight: 48,
    outlineStyle: 'none' as never,
  },
  segment: {
    alignItems: 'center',
    borderRadius: radii.sm,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 86,
    paddingHorizontal: spacing.lg,
  },
  segmentSelected: {
    backgroundColor: colors.accent,
  },
  segmentText: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '800',
  },
  segmentTextSelected: {
    color: colors.brandBlack,
  },
  segmentedControl: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    padding: spacing.xs,
  },
  shell: {
    gap: spacing.xl,
    marginHorizontal: 'auto' as never,
    maxWidth: 1140,
    padding: spacing.lg,
    width: '100%',
  },
  shellWide: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.xxl,
  },
  stateBody: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    maxWidth: 520,
    textAlign: 'center',
  },
  statePanel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xxl,
  },
  stateTitle: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.title,
    fontWeight: '900',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  summaryGridLandscape: {
    flexShrink: 0,
    width: 280,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
});
