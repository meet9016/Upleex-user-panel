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
  const [orders, setOrders] = useState<any[]>([]);
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
        
        // Fetch orders for dashboard
        await fetchOrders();
      } catch (e) {
        console.error('Error in checkAuthAndFetch', e);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        
        // Fetch both Rentals (Quotes) and standard Orders (Purchases)
        const [quotesRes, ordersRes] = await Promise.allSettled([
          api.get(`${endPointApi.quoteList}?limit=100`),
          api.get(`${endPointApi.userOrders}?limit=100`)
        ]);

        let allData: any[] = [];

        // 1. Handle Quotes (Rentals)
        if (quotesRes.status === 'fulfilled' && quotesRes.value.data.success) {
          const quotes = quotesRes.value.data.data.quotes || quotesRes.value.data.data || [];
          allData = [...quotes];
        }

        // 2. Handle Orders (Purchases) - Normalize to match Rental shape
        if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
          const orders = ordersRes.value.data.data.orders || [];
          const normalizedOrders = orders.flatMap((order: any) => 
            (order.items || []).map((item: any, idx: number) => ({
              // Use combined ID to avoid duplicate keys if an order has multiple items
              _id: `${order._id}-${item.product_id || idx}`,
              order_id: order.order_id,
              product_id: {
                _id: item.product_id,
                product_name: item.product_name,
                product_main_image: item.product_image,
                price: item.price,
                product_type_name: 'Sell' // Regular orders are Sell type
              },
              qty: item.quantity,
              calculated_price: item.final_amount,
              status: order.order_status,
              vendor_status: order.vendor_status, // Include vendor_status for Sell orders
              payment_status: order.payment_status,
              createdAt: order.createdAt,
              razorpay_payment_id: order.razorpay_payment_id
            }))
          );
          allData = [...allData, ...normalizedOrders];
        }

        // Sort by date descending
        allData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setOrders(allData);
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
            <UserDashboard orders={orders} loading={ordersLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}