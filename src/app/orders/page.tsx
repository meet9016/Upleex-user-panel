'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Package, Truck, CheckCircle, Calendar, Star } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';
import { BackButton } from '@/components/ui/BackButton';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { Copy } from 'lucide-react';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useRouter } from 'next/navigation';

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
  vendor_status: string;
  createdAt: string;
  razorpay_payment_id: string;
  type?: 'order' | 'quote';
  razorpay_payment_link?: string;
}


export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [verifying, setVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, quotesRes] = await Promise.allSettled([
        api.get(`${endPointApi.userOrders}?page=${page}&limit=10`),
        api.get(`${endPointApi.quoteList}?view_type=order&page=${page}&limit=10`)
      ]);

      let combined: Order[] = [];
      let maxPages = 1;

      if (ordersRes.status === 'fulfilled' && ordersRes.value.data.success) {
        const fetchedOrders = (ordersRes.value.data.data.orders || []).map((o: any) => ({ 
          ...o, 
          type: 'order',
          order_status: o.vendor_status || o.order_status 
        }));
        combined = [...combined, ...fetchedOrders];
        maxPages = Math.max(maxPages, ordersRes.value.data.data.pagination?.pages || 1);
      }

      if (quotesRes.status === 'fulfilled' && quotesRes.value.data.success) {
        const mappedQuotes = (quotesRes.value.data.data || [])
          .map((quote: any) => ({
            _id: quote._id,
            order_id: `QUOTE-${quote._id.slice(-6).toUpperCase()}`,
            items: [{
              product_id: quote.product_id?._id || '',
              product_name: quote.product_id?.product_name || 'Rent Product',
              product_image: quote.product_id?.product_main_image || '',
              price: (quote.calculated_price || 0) / (quote.qty || 1),
              quantity: quote.qty || 1,
              final_amount: quote.calculated_price || 0
            }],
            subtotal: quote.calculated_price || 0,
            gst_amount: 0,
            total_amount: quote.calculated_price || 0,
            payment_status: quote.payment_status || 'pending',
            order_status: quote.status || 'pending',
            createdAt: quote.createdAt,
            razorpay_payment_id: quote.razorpay_payment_id || '',
            type: 'quote',
            razorpay_payment_link: quote.razorpay_payment_link || '',
          }));
        combined = [...combined, ...mappedQuotes];
        maxPages = Math.max(maxPages, quotesRes.value.data.totalPages || 1);
      }

      // Sort combined by date descending
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(combined);
      setTotalPages(maxPages);
    } catch (error: any) {
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

  useEffect(() => {
    const handleVerify = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const razorpay_payment_id = searchParams.get('razorpay_payment_id');
      const razorpay_payment_link_id = searchParams.get('razorpay_payment_link_id');
      const razorpay_payment_link_status = searchParams.get('razorpay_payment_link_status');

      if (razorpay_payment_id || razorpay_payment_link_status) {
        setVerifying(true);
        try {
          const res = await api.post(endPointApi.quoteVerifyPayment, {
            razorpay_payment_id,
            razorpay_payment_link_id,
            razorpay_payment_link_reference_id: searchParams.get('razorpay_payment_link_reference_id'),
            razorpay_payment_link_status,
            razorpay_signature: searchParams.get('razorpay_signature'),
          });

          if (res.data.success) {
            toast.success('Payment verified successfully!');
            window.history.replaceState({}, '', '/orders');
          }
        } catch (error: any) {
          toast.error(error?.response?.data?.message || 'Payment verification failed');
          window.history.replaceState({}, '', '/orders');
        } finally {
          setVerifying(false);
          fetchOrders();
        }
      } else {
        fetchOrders();
      }
    };

    handleVerify();
  }, [page, activeTab]);

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
        <NavigationButtons />

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setActiveTab('orders'); setPage(1); }}
          >
            Purchased Products
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'quotes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setActiveTab('quotes'); setPage(1); }}
          >
            Rent / Quotes
          </button>
        </div>

        {(() => {
          const filteredOrders = orders.filter(o => o.type === (activeTab === 'orders' ? 'order' : 'quote'));

          if (filteredOrders.length === 0 && !loading) {
            return (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
                <ShoppingBag className="mx-auto h-20 w-20 text-gray-200 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">
                  No {activeTab === 'orders' ? 'purchased products' : 'rentals or quotes'} found
                </h3>
                <p className="text-gray-500 mt-2 font-medium">
                  {activeTab === 'orders'
                    ? "You haven't purchased any products yet."
                    : "You haven't requested any quotes or rentals yet."}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-6 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Products
                </button>
              </div>
            );
          }

          return (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredOrders.map((order, index) => (
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
                      <div className="flex gap-4 flex-wrap">
                        <StatusBadge status={order.payment_status} label="Payment" />
                        <StatusBadge status={order.order_status} label="Order" />
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
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-900">Total: </span>
                        <span className="font-bold text-lg text-blue-600">₹{order.total_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {order.razorpay_payment_id && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
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
                        {order.type === 'quote' && order.payment_status?.toLowerCase() !== 'paid' && ['approved', 'approval'].includes(order.order_status?.toLowerCase()) && order.razorpay_payment_link && (
                          <a
                            href={order.razorpay_payment_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                          >
                            Pay Now
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          );
        })()}
      </div>
    </div>
  );
}
