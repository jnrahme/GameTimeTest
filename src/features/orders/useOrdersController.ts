import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  getFilteredOrders,
  getOrderSummary,
} from '../../domain/orders/selectors';
import { Order, OrderFilter } from '../../domain/orders/types';
import { ordersApi, OrdersApi } from '../../services/ordersApi';

export interface OrdersControllerState {
  orders: Order[];
  visibleOrders: Order[];
  selectedOrderId?: string;
  selectedOrder?: Order;
  query: string;
  filter: OrderFilter;
  isLoadingOrders: boolean;
  isLoadingDetail: boolean;
  ordersError?: string;
  detailError?: string;
  summary: ReturnType<typeof getOrderSummary>;
  setQuery: (query: string) => void;
  setFilter: (filter: OrderFilter) => void;
  loadOrders: () => Promise<void>;
  selectOrder: (orderId: string) => Promise<void>;
  closeDetail: () => void;
}

export function useOrdersController(
  api: OrdersApi = ordersApi,
): OrdersControllerState {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [ordersError, setOrdersError] = useState<string | undefined>();
  const [detailError, setDetailError] = useState<string | undefined>();

  const loadOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setOrdersError(undefined);

    try {
      const response = await api.getOrders();
      setOrders(response.orders);
    } catch (error) {
      setOrdersError(getErrorMessage(error));
    } finally {
      setIsLoadingOrders(false);
    }
  }, [api]);

  const selectOrder = useCallback(
    async (orderId: string) => {
      setSelectedOrderId(orderId);
      setSelectedOrder(undefined);
      setIsLoadingDetail(true);
      setDetailError(undefined);

      try {
        const response = await api.getOrder(orderId);
        setSelectedOrder(response.order);
      } catch (error) {
        setDetailError(getErrorMessage(error));
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [api],
  );

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const visibleOrders = useMemo(() => {
    return getFilteredOrders(orders, { query, filter });
  }, [filter, orders, query]);

  const summary = useMemo(() => getOrderSummary(orders), [orders]);

  const closeDetail = useCallback(() => {
    setSelectedOrderId(undefined);
    setSelectedOrder(undefined);
    setDetailError(undefined);
  }, []);

  return {
    orders,
    visibleOrders,
    selectedOrderId,
    selectedOrder,
    query,
    filter,
    isLoadingOrders,
    isLoadingDetail,
    ordersError,
    detailError,
    summary,
    setQuery,
    setFilter,
    loadOrders,
    selectOrder,
    closeDetail,
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}
