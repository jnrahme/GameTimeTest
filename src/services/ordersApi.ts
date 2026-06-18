import { mockOrders } from '../data/mockOrders';
import { GetOrderResponse, GetOrdersResponse, Order } from '../domain/orders/types';

export interface OrdersApi {
  getOrders: () => Promise<GetOrdersResponse>;
  getOrder: (orderId: string) => Promise<GetOrderResponse>;
}

interface MockOrdersApiOptions {
  latencyMs?: number;
  orders?: Order[];
  shouldFail?: boolean;
}

export function createMockOrdersApi({
  latencyMs = 450,
  orders = mockOrders,
  shouldFail = false,
}: MockOrdersApiOptions = {}): OrdersApi {
  return {
    async getOrders() {
      await delay(latencyMs);
      assertNetwork(shouldFail);

      return {
        orders,
        page: 1,
        perPage: orders.length,
      };
    },

    async getOrder(orderId: string) {
      await delay(latencyMs);
      assertNetwork(shouldFail);

      const order = orders.find((item) => item.id === orderId);

      if (!order) {
        throw new Error(`Order ${orderId} was not found`);
      }

      return { order };
    },
  };
}

export const ordersApi = createMockOrdersApi();

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function assertNetwork(shouldFail: boolean) {
  if (shouldFail) {
    throw new Error('Unable to load orders. Please try again.');
  }
}
