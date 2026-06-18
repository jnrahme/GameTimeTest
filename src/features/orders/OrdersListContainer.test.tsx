import { fireEvent, render, screen } from '@testing-library/react-native';

import { mockOrders } from '../../data/mockOrders';
import { OrdersListContainer } from './OrdersListContainer';
import { useOrders } from './queries';

jest.mock('./queries', () => ({
  ...jest.requireActual('./queries'),
  useOrders: jest.fn(),
}));

jest.mock('@shopify/flash-list', () => {
  const { FlatList: MockFlashList } = jest.requireActual('react-native');
  return { FlashList: MockFlashList };
});

function mockUseOrders(overrides: Record<string, unknown> = {}) {
  jest.mocked(useOrders).mockReturnValue({
    data: { orders: mockOrders },
    isPending: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useOrders>);
}

function createNavigation() {
  return { navigate: jest.fn() } as never;
}

describe('OrdersListContainer', () => {
  afterEach(() => jest.clearAllMocks());

  it('navigates to the detail route with the tapped orderId', () => {
    mockUseOrders();
    const navigation = createNavigation();

    render(
      <OrdersListContainer navigation={navigation} route={{ params: undefined } as never} />,
    );

    fireEvent.press(screen.getByRole('button', { name: /lakers at warriors/i }));

    expect((navigation as { navigate: jest.Mock }).navigate).toHaveBeenCalledWith(
      'OrderDetail',
      { orderId: 'order-warriors-2026' },
    );
  });

  it('derives the filtered view from local search state', () => {
    mockUseOrders();

    render(
      <OrdersListContainer navigation={createNavigation()} route={{ params: undefined } as never} />,
    );

    fireEvent.changeText(screen.getByLabelText('Search orders'), 'oracle');

    expect(screen.getByText('Dodgers at Giants')).toBeTruthy();
    expect(screen.queryByText('Lakers at Warriors')).toBeNull();
  });

  it('surfaces the query error and refetches on retry', () => {
    const refetch = jest.fn();
    mockUseOrders({
      data: undefined,
      isError: true,
      error: new Error('Unable to load orders. Please try again.'),
      refetch,
    });

    render(
      <OrdersListContainer navigation={createNavigation()} route={{ params: undefined } as never} />,
    );

    expect(screen.getByText('Orders could not load')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
