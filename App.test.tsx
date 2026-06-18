import { render, screen } from '@testing-library/react-native';
import { ReactNode } from 'react';

import App from './App';

jest.mock('./src/features/orders/OrdersExperience', () => {
  const { Text } = jest.requireActual('react-native');

  return {
    OrdersExperience: () => <Text>Orders experience</Text>,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = jest.requireActual('react-native');

  return {
    SafeAreaProvider: ({ children }: { children: ReactNode }) => (
      <View>{children}</View>
    ),
    SafeAreaView: ({ children }: { children: ReactNode }) => (
      <View>{children}</View>
    ),
  };
});

describe('App', () => {
  it('renders the order experience inside the app shell', () => {
    render(<App />);

    expect(screen.getByText('Orders experience')).toBeTruthy();
  });
});
