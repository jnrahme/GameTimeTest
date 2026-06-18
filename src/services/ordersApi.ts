import { mockOrders } from '../data/mockOrders';
import {
  GetOrderResponseSchema,
  GetOrdersResponseSchema,
} from '../domain/orders/schema';
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

      // Validate at the trust boundary: a real backend response is `unknown`
      // until proven otherwise. `.parse` throws a typed error on drift, which
      // the query layer surfaces as an error state.
      return GetOrdersResponseSchema.parse({
        orders,
      });
    },

    async getOrder(orderId: string) {
      await delay(latencyMs);
      assertNetwork(shouldFail);

      const order = orders.find((item) => item.id === orderId);

      if (!order) {
        throw new Error(`Order ${orderId} was not found`);
      }

      return GetOrderResponseSchema.parse({ order });
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
