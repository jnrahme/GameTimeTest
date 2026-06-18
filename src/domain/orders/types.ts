export interface Event {
  id: string;
  name: string;
  datetime: string;
  imageUrl: string;
  venue: string;
  category: 'sports' | 'concert' | 'theater';
}

export interface Seat {
  section: string;
  row: string;
  seat: string;
}

export interface Order {
  id: string;
  confirmationNumber: string;
  event: Event;
  seats: Seat[];
  status: OrderStatus;
  receipt: Receipt;
  payment: PaymentSummary;
  purchaseDate: string;
}

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface Receipt {
  quantity: number;
  pricePerTicket: number;
  subtotal: number;
  fees: number;
  salesTax: number;
  discount?: Discount;
  total: number;
}

export interface Discount {
  code: string;
  amount: number;
}

export interface PaymentSummary {
  method: PaymentMethod;
  lastFour?: string;
  cardType?: string;
}

export type PaymentMethod = 'creditcard' | 'applepay' | 'paypal' | 'venmo';

export interface GetOrdersResponse {
  orders: Order[];
  page: number;
  perPage: number;
}

export interface GetOrderResponse {
  order: Order;
}

export type OrderFilter = 'all' | 'upcoming' | 'past';

export interface CalendarSharePayload {
  title: string;
  message: string;
  icsContent: string;
}
