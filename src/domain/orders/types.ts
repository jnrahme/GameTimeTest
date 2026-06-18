import { z } from 'zod';

import {
  DiscountSchema,
  EventSchema,
  GetOrderResponseSchema,
  GetOrdersResponseSchema,
  OrderSchema,
  OrderStatusSchema,
  PaymentMethodSchema,
  PaymentSummarySchema,
  ReceiptSchema,
  SeatSchema,
} from './schema';

// Domain types are inferred from the runtime schema so the two contracts
// (compile-time and runtime) cannot drift. Edit `schema.ts`, not these.
export type Event = z.infer<typeof EventSchema>;
export type Seat = z.infer<typeof SeatSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type Receipt = z.infer<typeof ReceiptSchema>;
export type Discount = z.infer<typeof DiscountSchema>;
export type PaymentSummary = z.infer<typeof PaymentSummarySchema>;
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;
export type GetOrdersResponse = z.infer<typeof GetOrdersResponseSchema>;
export type GetOrderResponse = z.infer<typeof GetOrderResponseSchema>;

// UI-only concerns that never cross the network — kept as plain types.
export type OrderFilter = 'all' | 'upcoming' | 'past';

export interface CalendarSharePayload {
  title: string;
  message: string;
  icsContent: string;
}
