import { act, renderHook, waitFor } from '@testing-library/react-native';

import { mockOrders } from '../../data/mockOrders';
import { OrdersApi } from '../../services/ordersApi';
import { useOrdersController } from './useOrdersController';

function createApi(overrides: Partial<OrdersApi> = {}): OrdersApi {
  return {
    getOrders: jest.fn().mockResolvedValue({ orders: mockOrders }),
    getOrder: jest.fn((orderId: string) => {
      const order = mockOrders.find((item) => item.id === orderId);

      if (!order) {
        return Promise.reject(new Error(`Order ${orderId} was not found`));
      }

      return Promise.resolve({ order });
    }),
    ...overrides,
  };
}

describe('useOrdersController', () => {
  it('loads orders and derives summary state on mount', async () => {
    const api = createApi();

    const { result } = renderHook(() => useOrdersController(api));

    await waitFor(() => expect(result.current.isLoadingOrders).toBe(false));

    expect(api.getOrders).toHaveBeenCalledTimes(1);
    expect(result.current.orders).toEqual(mockOrders);
    expect(result.current.summary.totalOrders).toBe(mockOrders.length);
  });

  it('surfaces load errors and recovers on retry', async () => {
    const getOrders = jest
      .fn()
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValueOnce({ orders: [mockOrders[0]] });
    const api = createApi({ getOrders });

    const { result } = renderHook(() => useOrdersController(api));

    await waitFor(() => expect(result.current.ordersError).toBe('network down'));

    await act(async () => {
      await result.current.loadOrders();
    });

    await waitFor(() => expect(result.current.ordersError).toBeUndefined());
    expect(result.current.orders).toEqual([mockOrders[0]]);
  });

  it('normalizes non-error load failures', async () => {
    const api = createApi({
      getOrders: jest.fn().mockRejectedValue('offline'),
    });

    const { result } = renderHook(() => useOrdersController(api));

    await waitFor(() => {
      expect(result.current.ordersError).toBe('Something went wrong.');
    });
  });

  it('selects an order through the detail API', async () => {
    const api = createApi();

    const { result } = renderHook(() => useOrdersController(api));

    await waitFor(() => expect(result.current.isLoadingOrders).toBe(false));

    await act(async () => {
      await result.current.selectOrder('order-warriors-2026');
    });

    expect(api.getOrder).toHaveBeenCalledWith('order-warriors-2026');
    expect(result.current.selectedOrderId).toBe('order-warriors-2026');
    expect(result.current.selectedOrder?.event.name).toBe('Lakers at Warriors');
    expect(result.current.detailError).toBeUndefined();
  });

  it('surfaces detail errors and clears them when closed', async () => {
    const api = createApi();

    const { result } = renderHook(() => useOrdersController(api));

    await waitFor(() => expect(result.current.isLoadingOrders).toBe(false));

    await act(async () => {
      await result.current.selectOrder('missing');
    });

    expect(result.current.detailError).toBe('Order missing was not found');
    expect(result.current.selectedOrderId).toBe('missing');

    act(() => {
      result.current.closeDetail();
    });

    expect(result.current.detailError).toBeUndefined();
    expect(result.current.selectedOrderId).toBeUndefined();
  });

  it('re-derives visible orders when query and filter change', async () => {
    const api = createApi();

    const { result } = renderHook(() => useOrdersController(api));

    await waitFor(() => expect(result.current.isLoadingOrders).toBe(false));

    act(() => {
      result.current.setQuery('oracle');
    });

    expect(result.current.visibleOrders.map((order) => order.id)).toEqual([
      'order-giants-2026',
    ]);

    act(() => {
      result.current.setFilter('upcoming');
    });

    expect(result.current.visibleOrders).toHaveLength(0);
  });
});
