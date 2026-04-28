import { useAppDispatch, useAppSelector } from './hooks';
import { fetchOrders, clearOrders } from './slices/orderSlice';

export const useOrderRedux = () => {
  const dispatch = useAppDispatch();
  const { orders, loading, error, currentPage, totalPages } = useAppSelector((state) => state.orders);

  const loadOrders = (page = 1, limit = 10) => {
    dispatch(fetchOrders({ page, limit }));
  };

  const clearOrdersData = () => {
    dispatch(clearOrders());
  };

  return {
    orders,
    loading,
    error,
    currentPage,
    totalPages,
    loadOrders,
    clearOrdersData,
  };
};
