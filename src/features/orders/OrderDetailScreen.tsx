import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  CreditCard,
  MapPin,
  ReceiptText,
  Ticket,
} from 'lucide-react-native';
import { ComponentType, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { ActionButton } from '../../components/ActionButton';
import { ReceiptRow } from '../../components/ReceiptRow';
import { SkeletonBlock } from '../../components/SkeletonBlock';
import { StatusPill } from '../../components/StatusPill';
import {
  formatEventDate,
  formatMoney,
  formatPayment,
  formatPurchaseDate,
  formatSeatList,
  getReceiptLineItems,
} from '../../domain/orders/formatters';
import { Order } from '../../domain/orders/types';
import { shareCalendarEvent, ShareResult } from '../../services/shareCalendar';
import { colors, radii, shadows, spacing, typography } from '../../theme/tokens';

interface OrderDetailScreenProps {
  order?: Order;
  isLoading: boolean;
  error?: string;
  onBack: () => void;
  onRetry: () => void;
}

type ShareState = 'idle' | 'sharing' | ShareResult | 'failed';

export function OrderDetailScreen({
  order,
  isLoading,
  error,
  onBack,
  onRetry,
}: OrderDetailScreenProps) {
  const { height, width } = useWindowDimensions();
  const isLandscape = width > height;
  const isWide = width >= 760;
  const [shareState, setShareState] = useState<ShareState>('idle');

  async function handleShare() {
    if (!order) {
      return;
    }

    setShareState('sharing');

    try {
      const result = await shareCalendarEvent(order);
      setShareState(result);
    } catch {
      setShareState('failed');
    }
  }

  if (isLoading) {
    return <DetailLoadingState onBack={onBack} />;
  }

  if (error || !order) {
    return (
      <View style={styles.errorScreen}>
        <ActionButton icon={ArrowLeft} title="Back" variant="secondary" onPress={onBack} />
        <View style={styles.errorPanel}>
          <Text style={styles.errorTitle}>Receipt unavailable</Text>
          <Text style={styles.errorBody}>
            {error ?? 'This order could not be found.'}
          </Text>
          <ActionButton title="Retry" onPress={onRetry} />
        </View>
      </View>
    );
  }

  const shareTitle = {
    idle: 'Share with Friends',
    sharing: 'Preparing Event',
    shared: 'Shared',
    copied: 'Copied',
    failed: 'Try Again',
  }[shareState];

  const ShareIcon = shareState === 'shared' || shareState === 'copied' ? Check : CalendarPlus;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.scroll}
    >
      <View style={[styles.shell, isWide && styles.shellWide]}>
        <ActionButton
          icon={ArrowLeft}
          title="Orders"
          variant="secondary"
          onPress={onBack}
          style={styles.backButton}
        />

        <View style={[styles.detailGrid, isWide && styles.detailGridWide]}>
          <View style={styles.mainColumn}>
            <ImageBackground
              accessibilityIgnoresInvertColors
              imageStyle={styles.heroImage}
              source={{ uri: order.event.imageUrl }}
              style={[styles.detailHero, isLandscape && styles.detailHeroLandscape]}
            >
              <LinearGradient
                colors={['rgba(23,20,18,0.05)', 'rgba(23,20,18,0.78)']}
                style={styles.heroGradient}
              />
              <View style={styles.heroContent}>
                <StatusPill status={order.status} />
                <View style={styles.heroTextBlock}>
                  <Text
                    style={[
                      styles.detailTitle,
                      isLandscape && styles.detailTitleLandscape,
                    ]}
                  >
                    {order.event.name}
                  </Text>
                  <View style={styles.locationRow}>
                    <MapPin color={colors.white} size={18} strokeWidth={2.2} />
                    <Text style={styles.locationText}>{order.event.venue}</Text>
                  </View>
                </View>
              </View>
            </ImageBackground>

            <View style={styles.infoBand}>
              <InfoTile
                icon={Ticket}
                label="Tickets"
                value={`${order.receipt.quantity}`}
              />
              <InfoTile
                icon={ReceiptText}
                label="Confirmation"
                value={order.confirmationNumber}
              />
              <InfoTile
                icon={CreditCard}
                label="Paid with"
                value={formatPayment(order.payment)}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Event details</Text>
              <View style={styles.detailRows}>
                <DetailRow label="When" value={formatEventDate(order.event.datetime)} />
                <DetailRow label="Where" value={order.event.venue} />
                <DetailRow label="Seats" value={formatSeatList(order.seats)} />
                <DetailRow
                  label="Purchased"
                  value={formatPurchaseDate(order.purchaseDate)}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.sideColumn,
              isWide && styles.sideColumnWide,
              isLandscape && styles.sideColumnLandscape,
            ]}
          >
            <View style={styles.receiptCard}>
              <Text style={styles.receiptTitle}>Receipt</Text>
              <Text style={styles.receiptSubtitle}>
                Order {order.confirmationNumber}
              </Text>

              <View style={styles.receiptRows}>
                {getReceiptLineItems(order).map((line) => (
                  <ReceiptRow
                    key={line.label}
                    label={line.label}
                    value={line.value}
                  />
                ))}
                <ReceiptRow
                  emphasized
                  label="Total"
                  value={formatMoney(order.receipt.total)}
                />
              </View>
            </View>

            <View style={styles.shareCard}>
              <View style={styles.shareIconFrame}>
                <CalendarPlus color={colors.coralDark} size={24} strokeWidth={2.2} />
              </View>
              <Text style={styles.shareTitle}>Bring the group in</Text>
              <Text style={styles.shareBody}>
                Generate a share-ready calendar event with date, venue, seats,
                and confirmation details.
              </Text>
              <ActionButton
                icon={ShareIcon}
                loading={shareState === 'sharing'}
                title={shareTitle}
                onPress={handleShare}
              />
              {shareState === 'failed' ? (
                <Text accessibilityRole="alert" style={styles.shareError}>
                  Sharing is not available in this environment.
                </Text>
              ) : null}
              {shareState === 'copied' ? (
                <Text style={styles.shareSuccess}>
                  Calendar details copied to the clipboard.
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function DetailLoadingState({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.loadingScreen}>
      <ActionButton icon={ArrowLeft} title="Orders" variant="secondary" onPress={onBack} />
      <SkeletonBlock height={340} />
      <SkeletonBlock height={130} />
      <SkeletonBlock height={260} />
    </View>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoTile}>
      <Icon color={colors.coralDark} size={20} strokeWidth={2.2} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
  },
  detailGrid: {
    gap: spacing.xl,
  },
  detailGridWide: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  detailHero: {
    aspectRatio: 16 / 11,
    backgroundColor: colors.brandBlack,
    borderRadius: radii.md,
    overflow: 'hidden',
    ...shadows.raised,
  },
  detailHeroLandscape: {
    aspectRatio: 16 / 8,
  },
  detailLabel: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  detailRow: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  detailRows: {
    gap: spacing.xs,
  },
  detailTitle: {
    color: colors.white,
    fontFamily: typography.family,
    fontSize: typography.sizes.hero,
    fontWeight: '900',
    lineHeight: 42,
    maxWidth: 640,
  },
  detailTitleLandscape: {
    fontSize: 30,
    lineHeight: 35,
  },
  detailValue: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 24,
  },
  errorBody: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  errorPanel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xxl,
  },
  errorScreen: {
    backgroundColor: colors.paper,
    flex: 1,
    gap: spacing.xl,
    padding: spacing.lg,
  },
  errorTitle: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.section,
    fontWeight: '900',
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.xl,
  },
  heroGradient: {
    ...StyleSheet.absoluteFill,
  },
  heroImage: {
    borderRadius: radii.md,
  },
  heroTextBlock: {
    gap: spacing.md,
  },
  infoBand: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  infoLabel: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.caption,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  infoTile: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    minWidth: 160,
    padding: spacing.lg,
  },
  infoValue: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    fontWeight: '800',
    lineHeight: 22,
  },
  loadingScreen: {
    backgroundColor: colors.paper,
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  locationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  locationText: {
    color: colors.white,
    flex: 1,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    fontWeight: '700',
    lineHeight: 22,
  },
  mainColumn: {
    flex: 1,
    gap: spacing.xl,
    minWidth: 0,
  },
  receiptCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
    ...shadows.subtle,
  },
  receiptRows: {
    marginTop: spacing.lg,
  },
  receiptSubtitle: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  receiptTitle: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.section,
    fontWeight: '900',
  },
  scroll: {
    backgroundColor: colors.paper,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  section: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.xl,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.section,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  shareBody: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 24,
  },
  shareCard: {
    backgroundColor: colors.surfaceWarm,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xl,
  },
  shareError: {
    color: colors.danger,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '700',
    lineHeight: 18,
  },
  shareIconFrame: {
    alignItems: 'center',
    backgroundColor: 'rgba(102, 250, 200, 0.14)',
    borderRadius: radii.md,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  shareSuccess: {
    color: colors.success,
    fontFamily: typography.family,
    fontSize: typography.sizes.label,
    fontWeight: '700',
    lineHeight: 18,
  },
  shareTitle: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.title,
    fontWeight: '900',
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
  sideColumn: {
    flexShrink: 0,
    gap: spacing.lg,
    width: '100%',
  },
  sideColumnWide: {
    width: 360,
  },
  sideColumnLandscape: {
    width: 320,
  },
});
