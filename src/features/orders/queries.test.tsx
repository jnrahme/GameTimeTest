import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { ReactNode } from 'react';

import { mockOrders } from '../../data/mockOrders';
import { ordersApi } from '../../services/ordersApi';
import { getErrorMessage, useOrder, useOrders } from './queries';

jest.mock('../../services/ordersApi', () => ({
  ordersApi: {
    getOrders: jest.fn(),
    getOrder: jest.fn(),
  },
}));

function wrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { gcTime: Infinity, retry: false } },
  });
  function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  }
  return QueryWrapper;
}

describe('orders queries', () => {
  afterEach(() => jest.clearAllMocks());

  it('useOrders resolves the orders payload', async () => {
    jest.mocked(ordersApi.getOrders).mockResolvedValue({ orders: mockOrders });

    const { result } = renderHook(() => useOrders(), { wrapper: wrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.orders).toEqual(mockOrders);
  });

  it('useOrder fetches a single order by id and stays disabled for empty ids', async () => {
    jest.mocked(ordersApi.getOrder).mockResolvedValue({ order: mockOrders[0] });

    const { result } = renderHook(() => useOrder('order-warriors-2026'), {
      wrapper: wrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(ordersApi.getOrder).toHaveBeenCalledWith('order-warriors-2026');

    renderHook(() => useOrder(''), { wrapper: wrapper() });
    expect(ordersApi.getOrder).toHaveBeenCalledTimes(1);
  });

  it('getErrorMessage unwraps Errors and falls back for non-Errors', () => {
    expect(getErrorMessage(new Error('network down'))).toBe('network down');
    expect(getErrorMessage('offline')).toBe('Something went wrong.');
  });
});
