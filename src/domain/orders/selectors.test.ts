import { mockOrders } from '../../data/mockOrders';
import { getFilteredOrders, getOrderSummary } from './selectors';

const now = new Date('2026-06-18T12:00:00-04:00');

describe('order selectors', () => {
  it('returns all orders sorted by event date when no filter is selected', () => {
    const orders = getFilteredOrders(mockOrders, {
      filter: 'all',
      query: '',
      now,
    });

    expect(orders.map((order) => order.id)).toEqual([
      'order-symphony-2026',
      'order-outside-lands-2026',
      'order-warriors-2026',
      'order-giants-2026',
    ]);
  });

  it('filters upcoming orders relative to a supplied clock', () => {
    const orders = getFilteredOrders(mockOrders, {
      filter: 'upcoming',
      query: '',
      now,
    });

    expect(orders.map((order) => order.id)).toEqual([
      'order-symphony-2026',
      'order-outside-lands-2026',
      'order-warriors-2026',
    ]);
  });

  it('filters past orders relative to a supplied clock', () => {
    const orders = getFilteredOrders(mockOrders, {
      filter: 'past',
      query: '',
      now,
    });

    expect(orders.map((order) => order.id)).toEqual(['order-giants-2026']);
  });

  it('searches across event, venue, confirmation, and status fields', () => {
    const orders = getFilteredOrders(mockOrders, {
      filter: 'all',
      query: 'oracle',
      now,
    });

    expect(orders).toHaveLength(1);
    expect(orders[0].id).toBe('order-giants-2026');
  });

  it('summarizes order count, upcoming count, and total spend', () => {
    expect(getOrderSummary(mockOrders, now)).toEqual({
      totalOrders: 4,
      upcomingOrders: 3,
      totalSpent: 179472,
    });
  });
});
