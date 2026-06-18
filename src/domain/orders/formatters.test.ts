import { mockOrders } from '../../data/mockOrders';
import {
  formatMoney,
  formatEventCategory,
  formatPayment,
  formatSeatSummary,
  getStatusLabel,
  getReceiptLineItems,
} from './formatters';

describe('order formatters', () => {
  it('formats cents as USD', () => {
    expect(formatMoney(42996)).toBe('$429.96');
  });

  it('summarizes multiple seats without losing section context', () => {
    expect(formatSeatSummary(mockOrders[0].seats)).toBe(
      '2 tickets - Sec 114, Row 12',
    );
  });

  it('summarizes a single seat directly', () => {
    expect(formatSeatSummary([mockOrders[0].seats[0]])).toBe(
      'Sec 114, Row 12, Seat 7',
    );
  });

  it('formats event categories for display', () => {
    expect(formatEventCategory('concert')).toBe('Concert');
  });

  it('formats payment methods with the available detail', () => {
    expect(formatPayment(mockOrders[0].payment)).toBe(
      'Apple Pay ending in 8842',
    );
    expect(formatPayment(mockOrders[1].payment)).toBe('PayPal');
    expect(formatPayment({ method: 'applepay' })).toBe('Apple Pay');
    expect(formatPayment({ method: 'creditcard' })).toBe('Card');
    expect(formatPayment({ method: 'creditcard', lastFour: '1111' })).toBe(
      'Card ending in 1111',
    );
    expect(formatPayment(mockOrders[2].payment)).toBe(
      'Mastercard ending in 4242',
    );
    expect(formatPayment({ method: 'venmo' })).toBe('Venmo');
  });

  it('formats every order status label', () => {
    expect(getStatusLabel('placed')).toBe('Placed');
    expect(getStatusLabel('confirmed')).toBe('Confirmed');
    expect(getStatusLabel('completed')).toBe('Completed');
    expect(getStatusLabel('cancelled')).toBe('Cancelled');
    expect(getStatusLabel('refunded')).toBe('Refunded');
  });

  it('includes discounts in receipt line items', () => {
    expect(getReceiptLineItems(mockOrders[0])).toEqual(
      expect.arrayContaining([{ label: 'Promo DUBS20', value: '-$20.00' }]),
    );
  });

  it('omits the promo line when the order has no discount', () => {
    const lines = getReceiptLineItems(mockOrders[1]);

    expect(lines).toHaveLength(3);
    expect(lines.some((line) => line.label.startsWith('Promo'))).toBe(false);
  });
});
