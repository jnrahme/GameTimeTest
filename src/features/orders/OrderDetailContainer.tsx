import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { RootStackParamList } from './navigation';
import { getErrorMessage, useOrder } from './queries';
import { OrderDetailScreen } from './OrderDetailScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

export function OrderDetailContainer({ route, navigation }: Props) {
  const { orderId } = route.params;
  const orderQuery = useOrder(orderId);

  return (
    <OrderDetailScreen
      order={orderQuery.data?.order}
      isLoading={orderQuery.isPending}
      error={orderQuery.isError ? getErrorMessage(orderQuery.error) : undefined}
      onBack={() => navigation.goBack()}
      onRetry={() => {
        void orderQuery.refetch();
      }}
    />
  );
}
