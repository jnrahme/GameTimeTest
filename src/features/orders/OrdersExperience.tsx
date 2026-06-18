import { useEffect } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { colors } from '../../theme/tokens';
import { OrderDetailScreen } from './OrderDetailScreen';
import { OrdersListScreen } from './OrdersListScreen';
import { useOrdersController } from './useOrdersController';

export function OrdersExperience() {
  const controller = useOrdersController();
  const isShowingDetail =
    !!controller.selectedOrder ||
    controller.isLoadingDetail ||
    !!controller.detailError;
  const { closeDetail } = controller;

  useEffect(() => {
    if (!isShowingDetail) {
      return undefined;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        closeDetail();
        return true;
      },
    );

    return () => subscription.remove();
  }, [closeDetail, isShowingDetail]);

  if (isShowingDetail) {
    return (
      <View style={styles.root}>
        <OrderDetailScreen
          error={controller.detailError}
          isLoading={controller.isLoadingDetail}
          order={controller.selectedOrder}
          onBack={controller.closeDetail}
          onRetry={() => {
            if (controller.selectedOrderId) {
              void controller.selectOrder(controller.selectedOrderId);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <OrdersListScreen
        error={controller.ordersError}
        filter={controller.filter}
        isLoading={controller.isLoadingOrders}
        orders={controller.visibleOrders}
        query={controller.query}
        summary={controller.summary}
        onFilterChange={controller.setFilter}
        onQueryChange={controller.setQuery}
        onRetry={() => void controller.loadOrders()}
        onSelectOrder={(orderId) => void controller.selectOrder(orderId)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.paper,
    flex: 1,
  },
});
