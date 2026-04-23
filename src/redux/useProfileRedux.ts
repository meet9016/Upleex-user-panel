import { useAppDispatch, useAppSelector } from './hooks';
import { fetchDashboard, updateProfile, clearDashboard } from './slices/profileSlice';

export const useProfileRedux = () => {
  const dispatch = useAppDispatch();
  const { dashboardData, loading, error } = useAppSelector((state) => state.profile);

  const loadDashboard = () => {
    dispatch(fetchDashboard());
  };

  const updateUserProfile = (profileData: any) => {
    return dispatch(updateProfile(profileData));
  };

  const clearDashboardData = () => {
    dispatch(clearDashboard());
  };

  return {
    dashboardData,
    loading,
    error,
    loadDashboard,
    updateUserProfile,
    clearDashboardData,
  };
};
