import { CalendarSharePayload, Order } from './types';
import {
  formatEventDate,
  formatMoney,
  formatSeatList,
  getStatusLabel,
} from './formatters';

// The prompt model has one event datetime and no end time, so shares assume a 3h event.
const EVENT_DURATION_HOURS = 3;

export function buildCalendarSharePayload(order: Order): CalendarSharePayload {
  const startsAt = new Date(order.event.datetime);
  const endsAt = new Date(
    startsAt.getTime() + EVENT_DURATION_HOURS * 60 * 60 * 1000,
  );

  const description = [
    `GameTime order ${order.confirmationNumber}`,
    formatSeatList(order.seats),
    `Status: ${getStatusLabel(order.status)}`,
    `Total: ${formatMoney(order.receipt.total)}`,
  ].join('\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GameTime Takehome//Order History//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${order.id}@gametime-takehome`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(startsAt)}`,
    `DTEND:${toIcsDate(endsAt)}`,
    `SUMMARY:${escapeIcsText(order.event.name)}`,
    `LOCATION:${escapeIcsText(order.event.venue)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return {
    title: order.event.name,
    message: [
      `Join me at ${order.event.name}.`,
      `${formatEventDate(order.event.datetime)} at ${order.event.venue}.`,
      `Seats: ${formatSeatList(order.seats)}.`,
      `Order total: ${formatMoney(order.receipt.total)}.`,
    ].join(' '),
    icsContent,
  };
}

export function toIcsDate(date: Date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

export function escapeIcsText(value: string) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}
