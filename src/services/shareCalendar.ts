import { Platform, Share } from 'react-native';

import { buildCalendarSharePayload } from '../domain/orders/calendar';
import { Order } from '../domain/orders/types';

export type ShareResult = 'shared' | 'copied';

export async function shareCalendarEvent(order: Order): Promise<ShareResult> {
  const payload = buildCalendarSharePayload(order);
  const message = `${payload.message}\n\n${payload.icsContent}`;

  if (Platform.OS === 'web') {
    const webNavigator = globalThis.navigator;

    if (typeof webNavigator.share === 'function') {
      await webNavigator.share({
        title: payload.title,
        text: message,
      });
      return 'shared';
    }

    if (webNavigator.clipboard) {
      await webNavigator.clipboard.writeText(message);
      return 'copied';
    }
  }

  await Share.share({
    title: payload.title,
    message,
  });

  return 'shared';
}
