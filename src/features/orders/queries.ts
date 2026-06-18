import { useQuery } from '@tanstack/react-query';

import { ordersApi } from '../../services/ordersApi';

/**
 * Server-state layer.
 *
 * Orders are *server* data, not application state: they have a fetch, a cache,
 * a freshness policy, and retry semantics. TanStack Query owns all of that, so
 * the screens never hand-roll loading/error/refetch flags. Filtering and search
 * stay as local UI state in the container, derived over `data` via pure
 * selectors.
 */
export const ordersKeys = {
  all: ['orders'] as const,
  detail: (orderId: string) => ['orders', orderId] as const,
};

export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.all,
    queryFn: () => ordersApi.getOrders(),
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ordersKeys.detail(orderId),
    queryFn: () => ordersApi.getOrder(orderId),
    enabled: orderId.length > 0,
  });
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}
