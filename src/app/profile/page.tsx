'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { UserDashboard } from '@/components/features/UserDashboard';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      setLoading(true);
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          toast.error('Please login first');
          router.push('/auth/login');
          return;
        }
        
        // Fetch dashboard data
        await fetchDashboardData();
      } catch (e) {
        console.error('Error in checkAuthAndFetch', e);
      } finally {
        setLoading(false);
      }
    };

    const fetchDashboardData = async () => {
      try {
        setOrdersLoading(true);
        const response = await api.get(endPointApi.userDashboard);
        if (response.data.success) {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    checkAuthAndFetch();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-black text-gray-900 mb-6">User Dashboard</h1>
            <UserDashboard dashboardData={dashboardData} loading={ordersLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}