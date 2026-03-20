'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, CreditCard, Package, Truck, CheckCircle } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';
import { BackButton } from '@/components/ui/BackButton';

interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  subtotal: number;
  final_amount: number;
}

interface Order {
  _id: string;
  order_id: string;
  user_name: string;
  items: OrderItem[];
  subtotal: number;
  gst_amount: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  createdAt: string;
  razorpay_payment_id: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'confirmed':
    case 'delivered':
      return 'text-green-600 bg-green-50';
    case 'pending':
    case 'processing':
      return 'text-yellow-600 bg-yellow-50';
    case 'shipped':
      return 'text-blue-600 bg-blue-50';
    case 'cancelled':
    case 'failed':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return <CheckCircle size={16} />;
    case 'processing':
      return <Package size={16} />;
    case 'shipped':
      return <Truck size={16} />;
    case 'delivered':
      return <CheckCircle size={16} />;
    default:
      return <Calendar size={16} />;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${endPointApi.userOrders}?page=${page}&limit=10`);
      
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        setTotalPages(response.data.data.pagination?.pages || 1);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(error?.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton label="Back to Shopping" />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-blue-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order.order_id}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.payment_status)}`}>
                        <CreditCard size={14} />
                        {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                      </span>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)}
                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden">
                          {item.product_image ? (
                            <img 
                              src={item.product_image.startsWith('http') ? item.product_image : `https://upleex.2min.cloud/${item.product_image}`}
                              alt={item.product_name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Package className="text-gray-400" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.final_amount.toLocaleString('en-IN')}</p>
                          <p className="text-sm text-gray-500">₹{item.price.toLocaleString('en-IN')} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">GST (18%)</span>
                      <span className="font-medium">₹{order.gst_amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-blue-600">₹{order.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Payment ID */}
                  {order.razorpay_payment_id && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Payment ID:</span> {order.razorpay_payment_id}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-8 space-x-2">
                <button
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}