import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';

import {
  getFilteredOrders,
  getOrderSummary,
} from '../../domain/orders/selectors';
import { OrderFilter } from '../../domain/orders/types';
import type { RootStackParamList } from './navigation';
import { getErrorMessage, useOrders } from './queries';
import { OrdersListScreen } from './OrdersListScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Orders'>;

export function OrdersListContainer({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<OrderFilter>('all');

  const ordersQuery = useOrders();
  const orders = useMemo(
    () => ordersQuery.data?.orders ?? [],
    [ordersQuery.data],
  );

  const visibleOrders = useMemo(
    () => getFilteredOrders(orders, { query, filter }),
    [orders, query, filter],
  );
  // Summary reflects the whole account, not the filtered view.
  const summary = useMemo(() => getOrderSummary(orders), [orders]);

  return (
    <OrdersListScreen
      orders={visibleOrders}
      query={query}
      filter={filter}
      summary={summary}
      isLoading={ordersQuery.isPending}
      error={
        ordersQuery.isError ? getErrorMessage(ordersQuery.error) : undefined
      }
      onQueryChange={setQuery}
      onFilterChange={setFilter}
      onRetry={() => {
        void ordersQuery.refetch();
      }}
      onSelectOrder={(orderId) =>
        navigation.navigate('OrderDetail', { orderId })
      }
    />
  );
}
