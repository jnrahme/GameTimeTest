import { fireEvent, render, screen } from '@testing-library/react-native';
import { FlashList } from '@shopify/flash-list';

import { mockOrders } from '../../data/mockOrders';
import { getOrderSummary } from '../../domain/orders/selectors';
import { OrdersListScreen } from './OrdersListScreen';

jest.mock('@shopify/flash-list', () => {
  const { FlatList: MockFlashList } = jest.requireActual('react-native');

  return {
    FlashList: MockFlashList,
  };
});

const defaultProps = {
  orders: mockOrders,
  query: '',
  filter: 'all' as const,
  summary: getOrderSummary(mockOrders),
  isLoading: false,
  onQueryChange: jest.fn(),
  onFilterChange: jest.fn(),
  onSelectOrder: jest.fn(),
  onRetry: jest.fn(),
};

describe('OrdersListScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders a virtualized order timeline and handles list actions', () => {
    const { UNSAFE_getByType } = render(<OrdersListScreen {...defaultProps} />);

    expect(screen.getByText('Your nights out, accounted for.')).toBeTruthy();
    expect(screen.getByText('Lakers at Warriors')).toBeTruthy();

    fireEvent.changeText(screen.getByLabelText('Search orders'), 'oracle');
    fireEvent.press(screen.getByRole('tab', { name: 'Upcoming' }));
    fireEvent.press(screen.getByRole('button', { name: /lakers at warriors/i }));

    const list = UNSAFE_getByType(FlashList);
    list.props.refreshControl.props.onRefresh();

    expect(defaultProps.onQueryChange).toHaveBeenCalledWith('oracle');
    expect(defaultProps.onFilterChange).toHaveBeenCalledWith('upcoming');
    expect(defaultProps.onSelectOrder).toHaveBeenCalledWith('order-warriors-2026');
    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows retry feedback when orders fail to load', () => {
    render(
      <OrdersListScreen
        {...defaultProps}
        error="Unable to load orders. Please try again."
        orders={[]}
      />,
    );

    expect(screen.getByText('Orders could not load')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Retry' }));

    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows loading and empty states', () => {
    const { rerender } = render(
      <OrdersListScreen {...defaultProps} isLoading orders={[]} />,
    );

    expect(screen.getByText('Your nights out, accounted for.')).toBeTruthy();

    rerender(<OrdersListScreen {...defaultProps} orders={[]} />);

    expect(screen.getByText('No orders match this view')).toBeTruthy();
  });

});
