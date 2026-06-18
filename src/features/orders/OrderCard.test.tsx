import { fireEvent, render, screen } from '@testing-library/react-native';

import { mockOrders } from '../../data/mockOrders';
import { OrderCard } from './OrderCard';

describe('OrderCard', () => {
  it('renders the order summary and opens the selected order', () => {
    const onPress = jest.fn();

    render(<OrderCard order={mockOrders[0]} onPress={onPress} />);

    expect(screen.getByText('Lakers at Warriors')).toBeTruthy();
    expect(screen.getByText('$429.96')).toBeTruthy();

    fireEvent.press(
      screen.getByRole('button', { name: /lakers at warriors/i }),
    );

    expect(onPress).toHaveBeenCalledWith('order-warriors-2026');
  });
});
