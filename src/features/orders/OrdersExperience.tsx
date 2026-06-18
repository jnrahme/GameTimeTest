import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme/tokens';
import { OrderDetailScreen } from './OrderDetailScreen';
import { OrdersListScreen } from './OrdersListScreen';
import { useOrdersController } from './useOrdersController';

export function OrdersExperience() {
  const controller = useOrdersController();

  if (controller.selectedOrder || controller.isLoadingDetail || controller.detailError) {
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
