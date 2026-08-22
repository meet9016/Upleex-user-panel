'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { UserDashboard } from '@/components/features/UserDashboard';
import Loader from '@/components/ui/Loader';
import { useAppSelector } from '@/redux/hooks';
import { useProfileRedux } from '@/redux/useProfileRedux';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { dashboardData, loading, loadDashboard } = useProfileRedux();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      setInitialLoading(true);
      try {
        if (!isAuthenticated) {
          toast.error('Please login first');
          router.push('/auth/login');
          return;
        }
        
        loadDashboard();
      } catch (e) {
        console.error('Error in checkAuthAndFetch', e);
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router, isAuthenticated]);

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">.
          <Loader/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <NavigationButtons />

          <div className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl font-black text-gray-900">User Dashboard</h1>
              {dashboardData && (dashboardData as any).gst_number && (
                <div className="mt-2 md:mt-0 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl inline-flex items-center gap-2">
                  <span className="text-gray-500">Your GSTIN:</span>
                  <span>{(dashboardData as any).gst_number}</span>
                </div>
              )}
            </div>
            <UserDashboard dashboardData={dashboardData} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}