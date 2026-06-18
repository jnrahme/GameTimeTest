import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AppErrorBoundary } from './AppErrorBoundary';

function ThrowingChild(): never {
  throw new Error('render failed');
}

describe('AppErrorBoundary', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when no error is thrown', () => {
    render(
      <AppErrorBoundary>
        <Text>Healthy app</Text>
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Healthy app')).toBeTruthy();
  });

  it('renders a controlled fallback after a render error', () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <AppErrorBoundary>
        <ThrowingChild />
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset screen' })).toBeTruthy();
  });
});
