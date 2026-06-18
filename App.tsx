import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppErrorBoundary } from './src/components/AppErrorBoundary';
import { OrdersExperience } from './src/features/orders/OrdersExperience';
import { colors } from './src/theme/tokens';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
        <StatusBar style="dark" />
        <AppErrorBoundary>
          <OrdersExperience />
        </AppErrorBoundary>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.paper,
    flex: 1,
  },
});
