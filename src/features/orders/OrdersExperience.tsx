import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { linking, RootStackParamList } from './navigation';
import { OrderDetailContainer } from './OrderDetailContainer';
import { OrdersListContainer } from './OrdersListContainer';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Real navigation stack. Android hardware-back, iOS swipe-back, route params,
 * and deep links all come from the navigator — no manual BackHandler needed.
 */
export function OrdersExperience() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Orders" component={OrdersListContainer} />
        <Stack.Screen name="OrderDetail" component={OrderDetailContainer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
