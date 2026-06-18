import { render } from '@testing-library/react-native';
import { BackHandler } from 'react-native';

import { mockOrders } from '../../data/mockOrders';
import { OrdersControllerState, useOrdersController } from './useOrdersController';
import { OrdersExperience } from './OrdersExperience';

jest.mock('./useOrdersController', () => ({
  useOrdersController: jest.fn(),
}));

jest.mock('./OrdersListScreen', () => ({
  OrdersListScreen: jest.fn(() => null),
}));

jest.mock('./OrderDetailScreen', () => ({
  OrderDetailScreen: jest.fn(() => null),
}));

const baseController: OrdersControllerState = {
  orders: mockOrders,
  visibleOrders: mockOrders,
  query: '',
  filter: 'all',
  isLoadingOrders: false,
  isLoadingDetail: false,
  summary: {
    totalOrders: mockOrders.length,
    upcomingOrders: 3,
    totalSpent: 179472,
  },
  setQuery: jest.fn(),
  setFilter: jest.fn(),
  loadOrders: jest.fn(),
  selectOrder: jest.fn(),
  closeDetail: jest.fn(),
};

describe('OrdersExperience', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it('closes the detail screen from the Android hardware back button', () => {
    const closeDetail = jest.fn();
    const remove = jest.fn();
    const addEventListener = jest
      .spyOn(BackHandler, 'addEventListener')
      .mockReturnValue({ remove });

    jest.mocked(useOrdersController).mockReturnValue({
      ...baseController,
      selectedOrder: mockOrders[0],
      selectedOrderId: mockOrders[0].id,
      closeDetail,
    });

    render(<OrdersExperience />);

    const handler = addEventListener.mock.calls[0][1];

    expect(handler()).toBe(true);
    expect(closeDetail).toHaveBeenCalledTimes(1);
  });

  it('renders the order list without registering detail back handling', () => {
    const addEventListener = jest.spyOn(BackHandler, 'addEventListener');

    jest.mocked(useOrdersController).mockReturnValue(baseController);

    render(<OrdersExperience />);

    expect(addEventListener).not.toHaveBeenCalled();
  });

  it('retries detail loading when the selected id is still known', () => {
    const selectOrder = jest.fn();

    jest.mocked(useOrdersController).mockReturnValue({
      ...baseController,
      detailError: 'Order missing was not found',
      selectedOrderId: 'missing',
      selectOrder,
    });

    render(<OrdersExperience />);

    const detailProps = jest.requireMock('./OrderDetailScreen')
      .OrderDetailScreen.mock.calls[0][0];

    detailProps.onRetry();

    expect(selectOrder).toHaveBeenCalledWith('missing');
  });
});
