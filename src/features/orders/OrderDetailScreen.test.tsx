import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';

import { mockOrders } from '../../data/mockOrders';
import { shareCalendarEvent } from '../../services/shareCalendar';
import { OrderDetailScreen } from './OrderDetailScreen';

jest.mock('../../services/shareCalendar', () => ({
  shareCalendarEvent: jest.fn(),
}));

describe('OrderDetailScreen', () => {
  beforeEach(() => {
    jest.mocked(shareCalendarEvent).mockResolvedValue('copied');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders receipt detail, category, and share feedback', async () => {
    render(
      <OrderDetailScreen
        isLoading={false}
        order={mockOrders[0]}
        onBack={jest.fn()}
        onRetry={jest.fn()}
      />,
    );

    expect(screen.getByText('Lakers at Warriors')).toBeTruthy();
    expect(screen.getByText('Sports')).toBeTruthy();
    expect(screen.getByText('$429.96')).toBeTruthy();

    fireEvent.press(
      screen.getByRole('button', { name: /share with friends/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText('Calendar details copied to the clipboard.'),
      ).toBeTruthy();
    });
    expect(shareCalendarEvent).toHaveBeenCalledWith(mockOrders[0]);
  });

  it('supports retry when receipt detail cannot load', () => {
    const onRetry = jest.fn();

    render(
      <OrderDetailScreen
        error="Order missing was not found"
        isLoading={false}
        onBack={jest.fn()}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByText('Receipt unavailable')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders the loading state and supports returning to orders', () => {
    const onBack = jest.fn();

    render(<OrderDetailScreen isLoading onBack={onBack} onRetry={jest.fn()} />);

    fireEvent.press(screen.getByRole('button', { name: 'Orders' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('shows share failure feedback when sharing rejects', async () => {
    jest
      .mocked(shareCalendarEvent)
      .mockRejectedValueOnce(new Error('share unavailable'));

    render(
      <OrderDetailScreen
        isLoading={false}
        order={mockOrders[0]}
        onBack={jest.fn()}
        onRetry={jest.fn()}
      />,
    );

    fireEvent.press(
      screen.getByRole('button', { name: /share with friends/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText('Sharing is not available in this environment.'),
      ).toBeTruthy();
    });
  });
});
