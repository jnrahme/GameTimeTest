import { mockOrders } from '../../data/mockOrders';
import {
  buildCalendarSharePayload,
  escapeIcsText,
  toIcsDate,
} from './calendar';

describe('calendar share payloads', () => {
  it('builds a valid calendar event from an order', () => {
    const payload = buildCalendarSharePayload(mockOrders[0]);

    expect(payload.title).toBe('Lakers at Warriors');
    expect(payload.message).toContain('Chase Center');
    expect(payload.icsContent).toContain('BEGIN:VCALENDAR');
    expect(payload.icsContent).toContain('BEGIN:VEVENT');
    expect(payload.icsContent).toContain('SUMMARY:Lakers at Warriors');
    expect(payload.icsContent).toContain(
      'LOCATION:Chase Center\\, San Francisco\\, CA',
    );
    expect(payload.icsContent).toContain('DTSTART:20260713T023000Z');
    expect(payload.icsContent).toContain('DTEND:20260713T053000Z');
  });

  it('escapes ICS text control characters', () => {
    expect(escapeIcsText('A, B; C\\D\nE')).toBe('A\\, B\\; C\\\\D\\nE');
  });

  it('formats UTC dates for ICS consumers', () => {
    expect(toIcsDate(new Date('2026-07-12T19:30:00-07:00'))).toBe(
      '20260713T023000Z',
    );
  });
});
