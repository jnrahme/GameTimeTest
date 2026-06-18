import { createMockOrdersApi } from './ordersApi';
import { mockOrders } from '../data/mockOrders';

describe('mock orders api', () => {
  it('returns a paged orders response', async () => {
    const api = createMockOrdersApi({ latencyMs: 0 });

    await expect(api.getOrders()).resolves.toEqual({
      orders: mockOrders,
    });
  });

  it('returns a specific order by id', async () => {
    const api = createMockOrdersApi({ latencyMs: 0 });

    await expect(api.getOrder('order-warriors-2026')).resolves.toEqual({
      order: mockOrders[0],
    });
  });

  it('surfaces not-found errors', async () => {
    const api = createMockOrdersApi({ latencyMs: 0 });

    await expect(api.getOrder('missing')).rejects.toThrow(
      'Order missing was not found',
    );
  });

  it('can simulate a network failure', async () => {
    const api = createMockOrdersApi({ latencyMs: 0, shouldFail: true });

    await expect(api.getOrders()).rejects.toThrow(
      'Unable to load orders. Please try again.',
    );
  });
});
