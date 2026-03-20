'use client';
import { useState, useEffect } from 'react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export const useOrders = () => {
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchOrderCount = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${endPointApi.userOrders}?page=1&limit=1`);
      if (response.data.success) {
        setOrderCount(response.data.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching order count:', error);
      setOrderCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      fetchOrderCount();
    }
  }, []);

  return { orderCount, loading, refreshOrderCount: fetchOrderCount };
};