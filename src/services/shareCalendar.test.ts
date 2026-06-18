import { Platform, Share } from 'react-native';

import { mockOrders } from '../data/mockOrders';
import { shareCalendarEvent } from './shareCalendar';

const originalPlatform = Platform.OS;
const originalNavigator = globalThis.navigator;

function setPlatform(os: typeof Platform.OS) {
  Object.defineProperty(Platform, 'OS', {
    configurable: true,
    get: () => os,
  });
}

function setNavigator(value: Partial<Navigator> | undefined) {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value,
  });
}

describe('shareCalendarEvent', () => {
  beforeEach(() => {
    jest.spyOn(Share, 'share').mockResolvedValue({
      action: Share.sharedAction,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    setPlatform(originalPlatform);
    setNavigator(originalNavigator);
  });

  it('uses native share outside web', async () => {
    setPlatform('ios');
    setNavigator(undefined);

    await expect(shareCalendarEvent(mockOrders[0])).resolves.toBe('shared');

    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('BEGIN:VCALENDAR'),
        title: 'Lakers at Warriors',
      }),
    );
  });

  it('uses Web Share API when available', async () => {
    const share = jest.fn().mockResolvedValue(undefined);
    setPlatform('web');
    setNavigator({ share });

    await expect(shareCalendarEvent(mockOrders[0])).resolves.toBe('shared');

    expect(share).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining('Order total: $429.96.'),
        title: 'Lakers at Warriors',
      }),
    );
    expect(Share.share).not.toHaveBeenCalled();
  });

  it('copies to clipboard when web share is unavailable', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    setPlatform('web');
    setNavigator({
      clipboard: { writeText } as unknown as Clipboard,
    });

    await expect(shareCalendarEvent(mockOrders[0])).resolves.toBe('copied');

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('BEGIN:VEVENT'),
    );
    expect(Share.share).not.toHaveBeenCalled();
  });

  it('falls back to native share when web navigator is unavailable', async () => {
    setPlatform('web');
    setNavigator(undefined);

    await expect(shareCalendarEvent(mockOrders[0])).resolves.toBe('shared');

    expect(Share.share).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Lakers at Warriors',
      }),
    );
  });
});
