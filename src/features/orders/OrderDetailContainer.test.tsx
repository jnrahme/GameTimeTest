import { fireEvent, render, screen } from '@testing-library/react-native';

import { mockOrders } from '../../data/mockOrders';
import { OrderDetailContainer } from './OrderDetailContainer';
import { useOrder } from './queries';

jest.mock('./queries', () => ({
  ...jest.requireActual('./queries'),
  useOrder: jest.fn(),
}));

jest.mock('../../services/shareCalendar', () => ({
  shareCalendarEvent: jest.fn().mockResolvedValue('shared'),
}));

function mockUseOrder(overrides: Record<string, unknown> = {}) {
  jest.mocked(useOrder).mockReturnValue({
    data: { order: mockOrders[0] },
    isPending: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useOrder>);
}

function renderDetail(navigation = { goBack: jest.fn() }) {
  return render(
    <OrderDetailContainer
      navigation={navigation as never}
      route={{ params: { orderId: 'order-warriors-2026' }, key: 'k', name: 'OrderDetail' } as never}
    />,
  );
}

describe('OrderDetailContainer', () => {
  afterEach(() => jest.clearAllMocks());

  it('reads orderId from the route and renders the receipt', () => {
    mockUseOrder();

    renderDetail();

    expect(useOrder).toHaveBeenCalledWith('order-warriors-2026');
    expect(screen.getByText('Lakers at Warriors')).toBeTruthy();
  });

  it('goes back through the navigator', () => {
    mockUseOrder();
    const navigation = { goBack: jest.fn() };

    renderDetail(navigation);

    fireEvent.press(screen.getByRole('button', { name: 'Orders' }));
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('surfaces detail errors and retries the query', () => {
    const refetch = jest.fn();
    mockUseOrder({
      data: undefined,
      isError: true,
      error: new Error('Order missing was not found'),
      refetch,
    });

    renderDetail();

    expect(screen.getByText('Receipt unavailable')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
