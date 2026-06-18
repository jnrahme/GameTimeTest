import { render, screen } from '@testing-library/react-native';
import { ReactNode } from 'react';

import { OrdersExperience } from './OrdersExperience';
import { linking } from './navigation';

jest.mock('@react-navigation/native', () => {
  const { View } = jest.requireActual('react-native');

  return {
    NavigationContainer: ({
      children,
      linking,
    }: {
      children: ReactNode;
      linking?: { prefixes?: string[] };
    }) => <View accessibilityLabel={linking?.prefixes?.[0]}>{children}</View>,
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const { Text, View } = jest.requireActual('react-native');

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: ReactNode }) => (
        <View>{children}</View>
      ),
      Screen: ({ name }: { name: string }) => <Text>{name}</Text>,
    }),
  };
});

jest.mock('./OrderDetailContainer', () => ({
  OrderDetailContainer: () => null,
}));

jest.mock('./OrdersListContainer', () => ({
  OrdersListContainer: () => null,
}));

describe('OrdersExperience', () => {
  it('registers the orders stack with deep-link configuration', () => {
    render(<OrdersExperience />);

    expect(screen.getByLabelText('gametime://')).toBeTruthy();
    expect(screen.getByText('Orders')).toBeTruthy();
    expect(screen.getByText('OrderDetail')).toBeTruthy();
  });

  it('keeps the public route map aligned with the app scheme', () => {
    expect(linking).toEqual({
      prefixes: ['gametime://'],
      config: {
        screens: {
          Orders: 'orders',
          OrderDetail: 'orders/:orderId',
        },
      },
    });
  });
});
