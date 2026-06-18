import { mockOrders } from '../../data/mockOrders';
import {
  formatMoney,
  formatPayment,
  formatSeatSummary,
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

  it('formats payment methods with the available detail', () => {
    expect(formatPayment(mockOrders[0].payment)).toBe(
      'Apple Pay ending in 8842',
    );
    expect(formatPayment(mockOrders[1].payment)).toBe('PayPal');
  });

  it('includes discounts in receipt line items', () => {
    expect(getReceiptLineItems(mockOrders[0])).toEqual(
      expect.arrayContaining([
        { label: 'Promo DUBS20', value: '-$20.00' },
      ]),
    );
  });
});
