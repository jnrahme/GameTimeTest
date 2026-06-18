import type { LinkingOptions } from '@react-navigation/native';

/**
 * Typed route map. `orderId` lives in the route params — not in a hook — so the
 * detail screen is addressable, deep-linkable, and restorable.
 */
export type RootStackParamList = {
  Orders: undefined;
  OrderDetail: { orderId: string };
};

// Deep-link readiness: gametime://orders and gametime://orders/:orderId both
// resolve to the right screen. Free once routes are real.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['gametime://'],
  config: {
    screens: {
      Orders: 'orders',
      OrderDetail: 'orders/:orderId',
    },
  },
};
