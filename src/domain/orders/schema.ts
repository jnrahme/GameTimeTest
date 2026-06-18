import { z } from 'zod';

/**
 * Runtime contract for the orders API.
 *
 * This is the trust boundary: anything crossing the network seam is validated
 * here before it is allowed into the domain. Types are *derived* from these
 * schemas (see `types.ts`) so the compile-time and runtime contracts can never
 * drift apart.
 *
 * When the wire (DTO) shape and the domain shape diverge — e.g. the backend
 * sends snake_case or epoch millis — add a `.transform()` here to map DTO ->
 * domain. Today they are identical, so a separate DTO type would be ceremony.
 */

const cents = z.number().int().nonnegative();

export const SeatSchema = z.object({
  section: z.string(),
  row: z.string(),
  seat: z.string(),
});

export const EventSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  datetime: z.string().min(1),
  imageUrl: z.string().min(1),
  venue: z.string().min(1),
  category: z.enum(['sports', 'concert', 'theater']),
});

export const DiscountSchema = z.object({
  code: z.string().min(1),
  amount: cents,
});

export const ReceiptSchema = z.object({
  quantity: z.number().int().positive(),
  pricePerTicket: cents,
  subtotal: cents,
  fees: cents,
  salesTax: cents,
  discount: DiscountSchema.optional(),
  total: cents,
});

export const PaymentMethodSchema = z.enum([
  'creditcard',
  'applepay',
  'paypal',
  'venmo',
]);

export const PaymentSummarySchema = z.object({
  method: PaymentMethodSchema,
  lastFour: z.string().optional(),
  cardType: z.string().optional(),
});

export const OrderStatusSchema = z.enum([
  'placed',
  'confirmed',
  'completed',
  'cancelled',
  'refunded',
]);

export const OrderSchema = z.object({
  id: z.string().min(1),
  confirmationNumber: z.string().min(1),
  event: EventSchema,
  seats: z.array(SeatSchema).min(1),
  status: OrderStatusSchema,
  receipt: ReceiptSchema,
  payment: PaymentSummarySchema,
  purchaseDate: z.string().min(1),
});

export const GetOrdersResponseSchema = z.object({
  orders: z.array(OrderSchema),
});

export const GetOrderResponseSchema = z.object({
  order: OrderSchema,
});
