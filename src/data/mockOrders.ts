import { Order } from '../domain/orders/types';

export const mockOrders: Order[] = [
  {
    id: 'order-warriors-2026',
    confirmationNumber: 'GT-8K42-WAR',
    event: {
      id: 'event-warriors-lakers',
      name: 'Lakers at Warriors',
      datetime: '2026-07-12T19:30:00-07:00',
      imageUrl:
        'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85',
      venue: 'Chase Center, San Francisco, CA',
      category: 'sports',
    },
    seats: [
      { section: '114', row: '12', seat: '7' },
      { section: '114', row: '12', seat: '8' },
    ],
    status: 'confirmed',
    receipt: {
      quantity: 2,
      pricePerTicket: 18450,
      subtotal: 36900,
      fees: 4820,
      salesTax: 3276,
      discount: { code: 'DUBS20', amount: 2000 },
      total: 42996,
    },
    payment: {
      method: 'applepay',
      lastFour: '8842',
      cardType: 'visa',
    },
    purchaseDate: '2026-06-05T15:24:00-07:00',
  },
  {
    id: 'order-outside-lands-2026',
    confirmationNumber: 'GT-3Q91-OSL',
    event: {
      id: 'event-outside-lands',
      name: 'Outside Lands: Friday Pass',
      datetime: '2026-08-07T12:00:00-07:00',
      imageUrl:
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=85',
      venue: 'Golden Gate Park, San Francisco, CA',
      category: 'concert',
    },
    seats: [
      { section: 'GA', row: 'Entry', seat: 'Pass 1' },
      { section: 'GA', row: 'Entry', seat: 'Pass 2' },
      { section: 'GA', row: 'Entry', seat: 'Pass 3' },
    ],
    status: 'placed',
    receipt: {
      quantity: 3,
      pricePerTicket: 22900,
      subtotal: 68700,
      fees: 7911,
      salesTax: 6017,
      total: 82628,
    },
    payment: {
      method: 'paypal',
    },
    purchaseDate: '2026-05-29T09:10:00-07:00',
  },
  {
    id: 'order-giants-2026',
    confirmationNumber: 'GT-7F18-SFG',
    event: {
      id: 'event-giants-dodgers',
      name: 'Dodgers at Giants',
      datetime: '2026-05-19T18:45:00-07:00',
      imageUrl:
        'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1200&q=85',
      venue: 'Oracle Park, San Francisco, CA',
      category: 'sports',
    },
    seats: [
      { section: 'Club 221', row: 'G', seat: '13' },
      { section: 'Club 221', row: 'G', seat: '14' },
    ],
    status: 'refunded',
    receipt: {
      quantity: 2,
      pricePerTicket: 9650,
      subtotal: 19300,
      fees: 2440,
      salesTax: 1706,
      discount: { code: 'BAYAREA', amount: 1500 },
      total: 21946,
    },
    payment: {
      method: 'creditcard',
      lastFour: '4242',
      cardType: 'mastercard',
    },
    purchaseDate: '2026-04-28T20:12:00-07:00',
  },
  {
    id: 'order-symphony-2026',
    confirmationNumber: 'GT-9M27-SYM',
    event: {
      id: 'event-sf-symphony',
      name: 'SF Symphony: Film Night',
      datetime: '2026-09-02T20:00:00-07:00',
      imageUrl:
        'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=85',
      venue: 'Davies Symphony Hall, San Francisco, CA',
      category: 'theater',
    },
    seats: [
      { section: 'Orchestra', row: 'K', seat: '5' },
      { section: 'Orchestra', row: 'K', seat: '6' },
    ],
    status: 'cancelled',
    receipt: {
      quantity: 2,
      pricePerTicket: 13200,
      subtotal: 26400,
      fees: 3180,
      salesTax: 2322,
      total: 31902,
    },
    payment: {
      method: 'venmo',
    },
    purchaseDate: '2026-06-14T11:38:00-07:00',
  },
];
