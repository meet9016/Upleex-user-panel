import { useAppDispatch, useAppSelector } from './hooks';
import { addToCart as addToCartAction, updateCartItem, removeFromCart as removeFromCartAction, clearCart, fetchCart } from './slices/cartSlice';

export const useCartRedux = () => {
  const dispatch = useAppDispatch();
  const { items, summary, loading } = useAppSelector((state) => state.cart);

  const count = items.length;
  const totalAmount = summary ? parseFloat(summary.grand_total) : 
                     items.reduce((acc: number, item: any) => acc + parseFloat(item.final_amount), 0);

  const handleAddToCart = async (productId: string, qty: number) => {
    dispatch(addToCartAction({ productId, qty }));
  };

  const handleUpdateQuantity = async (cartId: string, qty: number) => {
    dispatch(updateCartItem({ cartId, qty }));
  };

  const handleRemoveFromCart = async (cartId: string) => {
    dispatch(removeFromCartAction(cartId));
  };

  const handleClearCart = async () => {
    dispatch(clearCart());
  };

  const handleRefreshCart = async () => {
    dispatch(fetchCart());
  };

  return {
    items,
    count,
    summary,
    totalAmount,
    loading,
    addToCart: handleAddToCart,
    updateQuantity: handleUpdateQuantity,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,
    refreshCart: handleRefreshCart,
  };
};
