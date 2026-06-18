import { Component, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '../theme/tokens';
import { ActionButton } from './ActionButton';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.screen}>
        <View style={styles.panel}>
          <Text accessibilityRole="header" style={styles.title}>
            Something went wrong
          </Text>
          <Text style={styles.body}>
            The order history view hit an unexpected error. Reset the screen and
            try again.
          </Text>
          <ActionButton title="Reset screen" onPress={this.reset} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    color: colors.muted,
    fontFamily: typography.family,
    fontSize: typography.sizes.body,
    lineHeight: 24,
    textAlign: 'center',
  },
  panel: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xxl,
  },
  screen: {
    backgroundColor: colors.paper,
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: {
    color: colors.ink,
    fontFamily: typography.family,
    fontSize: typography.sizes.section,
    fontWeight: '900',
    textAlign: 'center',
  },
});
