'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Package, Truck, CheckCircle, Calendar, Star } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';
import { BackButton } from '@/components/ui/BackButton';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { ReviewModal } from '@/components/features/ReviewModal';
import { Copy } from 'lucide-react';
interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  final_amount: number;
}

interface Order {
  _id: string;
  order_id: string;
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
    case 'delivered': return 'text-green-700 bg-green-100';
    case 'pending':
    case 'processing': return 'text-yellow-700 bg-yellow-100';
    case 'shipped': return 'text-blue-700 bg-blue-100';
    case 'cancelled':
    case 'failed': return 'text-red-700 bg-red-100';
    default: return 'text-gray-700 bg-gray-100';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed':
    case 'delivered': return <CheckCircle size={16} />;
    case 'processing': return <Package size={16} />;
    case 'shipped': return <Truck size={16} />;
    default: return <Calendar size={16} />;
  }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    productId: string;
    productName: string;
    productImage?: string;
  } | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${endPointApi.userOrders}?page=${page}&limit=10`);
      
      if (response.data.success) {
        setOrders(response.data.data.orders || []);
        setTotalPages(response.data.data.pagination?.pages || 1);
      }
    } catch (error: any) {
      // Handle case when user is not logged in - just show empty orders
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        setOrders([]);
        setTotalPages(1);
      } else {
        toast.error(error?.response?.data?.message || 'Failed to fetch orders');
      }
    } finally {
      setLoading(false);
    }
  };
const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Payment ID copied!');
};

const openReviewModal = (item: OrderItem) => {
  setSelectedProduct({
    productId: item.product_id,
    productName: item.product_name,
    productImage: item.product_image
  });
  setReviewModalOpen(true);
};
  useEffect(() => {
    fetchOrders();
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl p-5 h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* <div className="mb-6">
          <BackButton label="Back to Shopping" />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag className="text-blue-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div> */}

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="mx-auto h-20 w-20 text-gray-300 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900">No orders found</h3>
            <p className="text-gray-500 mt-3">Orders will appear here when available.</p>
          </div>
        ) : (
          <>
            {/* Navigation Buttons Component */}
            <NavigationButtons />

            {/* 2 Columns Grid - Desktop ma 2 orders side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">Order ID: {order.order_id}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'short', year: 'numeric' 
                        })}
                      </p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(order.payment_status)}`}>
                        <CreditCard size={14} /> {order.payment_status}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(order.order_status)}`}>
                        {getStatusIcon(order.order_status)} {order.order_status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                          {item.product_image ? (
                            <img 
                              src={item.product_image.startsWith('http') 
                                ? item.product_image 
                                : `https://upleex.2min.cloud/${item.product_image}`}
                              alt={item.product_name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <Package className="m-auto text-gray-400" size={32} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 line-clamp-2 text-[15px] leading-tight">
                            {item.product_name}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-semibold text-gray-900">₹{item.final_amount.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                          
                          {/* Write Review Button - Only for delivered orders */}
                          {order.order_status.toLowerCase() === 'delivered' && (
                            <button
                              onClick={() => openReviewModal(item)}
                              className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                            >
                              <Star size={12} className="fill-current" />
                              Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer - Total */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-900">Total: </span>
                      <span className="font-bold text-lg text-blue-600">₹{order.total_amount.toLocaleString('en-IN')}</span>
                    </div>
                      {order.razorpay_payment_id && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-bold  ">
                          <span>Payment ID: {order.razorpay_payment_id}</span>

                        <button
                        onClick={() => handleCopy(order.razorpay_payment_id)}
                        title="Copy Payment ID"
                        className="p-1 hover:bg-gray-200 rounded transition"
                      >
                        <Copy size={14} />
                      </button>
                        </div>
                      )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-6 py-2.5 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <span className="px-6 py-2.5 bg-white border rounded-lg text-sm font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-6 py-2.5 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Review Modal */}
      {selectedProduct && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.productId}
          productName={selectedProduct.productName}
          productImage={selectedProduct.productImage}
        />
      )}
    </div>
  );
}
