import { useAppDispatch, useAppSelector } from './hooks';
import { logout as logoutAction, clearError } from './slices/authSlice';

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading, error, userType, step } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    userType,
    step,
    logout: handleLogout,
    clearError: handleClearError,
  };
};
