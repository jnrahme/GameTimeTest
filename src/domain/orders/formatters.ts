import { Event, Order, OrderStatus, PaymentSummary, Seat } from './types';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatMoney(cents: number) {
  return currencyFormatter.format(cents / 100);
}

export function formatEventDate(isoDate: string) {
  return dateFormatter.format(new Date(isoDate));
}

export function formatPurchaseDate(isoDate: string) {
  return shortDateFormatter.format(new Date(isoDate));
}

export function formatEventCategory(category: Event['category']) {
  return {
    sports: 'Sports',
    concert: 'Concert',
    theater: 'Theater',
  }[category];
}

export function formatSeatList(seats: Seat[]) {
  return seats
    .map((seat) => `Sec ${seat.section}, Row ${seat.row}, Seat ${seat.seat}`)
    .join(' | ');
}

export function formatSeatSummary(seats: Seat[]) {
  if (seats.length === 1) {
    return formatSeatList(seats);
  }

  const firstSeat = seats[0];
  return `${seats.length} tickets - Sec ${firstSeat.section}, Row ${firstSeat.row}`;
}

export function formatPayment(payment: PaymentSummary) {
  if (payment.method === 'applepay') {
    return payment.lastFour ? `Apple Pay ending in ${payment.lastFour}` : 'Apple Pay';
  }

  if (payment.method === 'creditcard') {
    const cardType = payment.cardType ? titleCase(payment.cardType) : 'Card';
    return payment.lastFour ? `${cardType} ending in ${payment.lastFour}` : cardType;
  }

  return {
    paypal: 'PayPal',
    venmo: 'Venmo',
  }[payment.method];
}

export function getStatusLabel(status: OrderStatus) {
  return {
    placed: 'Placed',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  }[status];
}

export function getReceiptLineItems(order: Order) {
  const { receipt } = order;
  const lines = [
    {
      label: `${receipt.quantity} x ${formatMoney(receipt.pricePerTicket)}`,
      value: formatMoney(receipt.subtotal),
    },
    { label: 'Service fees', value: formatMoney(receipt.fees) },
    { label: 'Sales tax', value: formatMoney(receipt.salesTax) },
  ];

  if (receipt.discount) {
    lines.push({
      label: `Promo ${receipt.discount.code}`,
      value: `-${formatMoney(receipt.discount.amount)}`,
    });
  }

  return lines;
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
