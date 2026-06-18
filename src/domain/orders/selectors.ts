import { Order, OrderFilter } from './types';

export interface OrderQuery {
  filter: OrderFilter;
  query: string;
  now?: Date;
}

export interface OrderSummary {
  totalOrders: number;
  upcomingOrders: number;
  totalSpent: number;
}

export function getFilteredOrders(orders: Order[], query: OrderQuery) {
  const now = query.now ?? new Date();
  const normalizedQuery = query.query.trim().toLowerCase();

  return orders
    .filter((order) => {
      if (query.filter === 'upcoming') {
        return isUpcomingOrder(order, now);
      }

      if (query.filter === 'past') {
        return !isUpcomingOrder(order, now);
      }

      return true;
    })
    .filter((order) => {
      if (!normalizedQuery) {
        return true;
      }

      const searchableText = [
        order.event.name,
        order.event.venue,
        order.confirmationNumber,
        order.status,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    })
    .sort((a, b) => {
      return (
        new Date(b.event.datetime).getTime() -
        new Date(a.event.datetime).getTime()
      );
    });
}

export function getOrderSummary(
  orders: Order[],
  now = new Date(),
): OrderSummary {
  return {
    totalOrders: orders.length,
    upcomingOrders: orders.filter((order) => isUpcomingOrder(order, now))
      .length,
    totalSpent: orders.reduce((sum, order) => sum + order.receipt.total, 0),
  };
}

export function isUpcomingOrder(order: Order, now = new Date()) {
  return new Date(order.event.datetime).getTime() >= now.getTime();
}
