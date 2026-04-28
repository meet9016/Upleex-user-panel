'use client';

import { Provider } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { fetchCart } from './slices/cartSlice';
import { fetchWishlist } from './slices/wishlistSlice';
import { getSecureToken } from '@/utils/cryptoUtils';

// Component to handle data fetching when authenticated
function DataFetcher({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getSecureToken();
    if (token) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <DataFetcher>{children}</DataFetcher>
    </Provider>
  );
}
