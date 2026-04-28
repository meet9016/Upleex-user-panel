import { useAppDispatch, useAppSelector } from './hooks';
import { addToWishlist as addToWishlistAction, removeFromWishlist as removeFromWishlistAction, toggleWishlist as toggleWishlistAction, fetchWishlist } from './slices/wishlistSlice';

export const useWishlistRedux = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.wishlist);

  const count = items.length;

  const handleAddToWishlist = async (productId: string, onAuthRequired?: () => void) => {
    const result = await dispatch(addToWishlistAction(productId));
    if (addToWishlistAction.rejected.match(result) && result.payload === 'AUTH_REQUIRED') {
      if (onAuthRequired) {
        onAuthRequired();
      }
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    dispatch(removeFromWishlistAction(productId));
  };

  const handleToggleWishlist = async (productId: string, onAuthRequired?: () => void): Promise<boolean> => {
    const result = await dispatch(toggleWishlistAction(productId));
    if (toggleWishlistAction.fulfilled.match(result)) {
      return result.payload.inWishlist;
    }
    // Check if rejected due to auth required
    if (toggleWishlistAction.rejected.match(result) && result.payload === 'AUTH_REQUIRED') {
      if (onAuthRequired) {
        onAuthRequired();
      }
    }
    return false;
  };

  const isInWishlist = (productId: string): boolean => {
    if (!productId) return false;
    return items.some((item: any) => item.product_id?.id === productId);
  };

  const handleFetchWishlist = async () => {
    dispatch(fetchWishlist());
  };

  return {
    items,
    count,
    loading,
    addToWishlist: handleAddToWishlist,
    removeFromWishlist: handleRemoveFromWishlist,
    toggleWishlist: handleToggleWishlist,
    isInWishlist,
    fetchWishlist: handleFetchWishlist,
  };
};
