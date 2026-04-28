'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Copy } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-hot-toast';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { Pagination } from '@/components/ui/Pagination';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useRouter } from 'next/navigation';
import BillingInvoice from '@/components/features/BillingInvoice';
import { FaFileInvoice } from 'react-icons/fa';
import { Modal } from '@/components/ui/Modal';
import { Loader } from '@/components/ui/Loader';

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

import { useOrderRedux } from '@/redux/useOrderRedux';

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading, currentPage, totalPages, loadOrders } = useOrderRedux();
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes'>('orders');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any>(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const handleDownloadInvoice = async (order: any) => {
    setShowInvoiceModal(true);
    setInvoiceLoading(true);
    try {
      if (order.type === 'quote') {
        const res = await api.get(`${endPointApi.quoteById}/${order._id}`);
        if (res.data?.success) {
          const fullQuote = res.data.data;
          setSelectedOrderForInvoice({
            ...order,
            ...fullQuote,
            type: 'quote',
          });
        } else {
          setSelectedOrderForInvoice(order);
        }
      } else {
        setSelectedOrderForInvoice(order);
      }
    } catch {
      setSelectedOrderForInvoice(order);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const [verifying, setVerifying] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Payment ID copied!');
  };

  useEffect(() => {
    const handleVerify = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const razorpay_payment_id = searchParams.get('razorpay_payment_id');
      const razorpay_payment_link_status = searchParams.get('razorpay_payment_link_status');

      if (razorpay_payment_id || razorpay_payment_link_status) {
        setVerifying(true);
        try {
          const res = await api.post(endPointApi.quoteVerifyPayment, {
            razorpay_payment_id,
            razorpay_payment_link_id: searchParams.get('razorpay_payment_link_id'),
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
          loadOrders(currentPage);
        }
      } else {
        loadOrders(currentPage);
      }
    };

    handleVerify();
  }, [currentPage, activeTab]);

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
            onClick={() => { setActiveTab('orders'); loadOrders(1); }}
          >
            Purchased Products
          </button>
          <button
            className={`py-3 px-6 text-sm font-medium border-b-2 transition-colors ${activeTab === 'quotes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => { setActiveTab('quotes'); loadOrders(1); }}
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
                    key={order._id || `order-${index}`}
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
                  <div className="p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                            {item.product_image ? (
                              <img
                                src={item.product_image.startsWith('http')
                                  ? item.product_image
                                  : `https://upleex.2min.cloud/${item.product_image}`}
                                alt={item.product_name}
                                className="w-full h-full object-contain p-1"
                              />
                            ) : (
                              <Package className="m-auto text-gray-400" size={28} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight">
                              {item.product_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                            <div className="mt-1">
                              <span className="font-semibold text-gray-900 text-sm">
                                ₹{item.final_amount.toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-gray-400 ml-1">
                                (₹{item.price} × {item.quantity})
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                    {/* Footer */}
                <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Total Amount: </span>
                    <span className="font-bold text-lg text-blue-600">₹{order.total_amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {order.razorpay_payment_id && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                        <span>Payment ID: {order.razorpay_payment_id.slice(-8)}</span>
                        <button
                          onClick={() => handleCopy(order.razorpay_payment_id)}
                          title="Copy Payment ID"
                          className="p-1 hover:bg-gray-200 rounded transition"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    )}
                    {order.type === 'quote' && 
                    order.payment_status?.toLowerCase() !== 'paid' && 
                    ['approved', 'approval'].includes(order.order_status?.toLowerCase()) && 
                    order.razorpay_payment_link && (
                      <a
                        href={order.razorpay_payment_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                      >
                        Pay Now
                      </a>
                    )}
                    {order.payment_status?.toLowerCase() === 'paid' && 
                    ['completed', 'complete', 'delivered', 'successful', 'success'].includes(order.order_status?.toLowerCase()) && (
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition"
                      >
                        <FaFileInvoice size={14} />
                        Invoice
                      </button>
                    )}
                  </div>
                </div>
                  </motion.div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => loadOrders(page)}
              />
            </>
          );
        })()}
      </div>

      {showInvoiceModal && selectedOrderForInvoice && (
        <Modal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          hideHeader={true}
          hideCloseButton={true}
          noPadding={true}
          className="max-w-6xl bg-transparent shadow-none"
        >
          <div className="relative flex justify-center">
            {invoiceLoading ? (
              <div className="bg-white p-20 rounded-xl flex flex-col items-center justify-center">
                <Loader />
                <p className="text-gray-600 mt-4">Preparing your invoice...</p>
              </div>
            ) : (
              <BillingInvoice 
                data={selectedOrderForInvoice} 
                vendorProfile={selectedOrderForInvoice.vendor_details?.[0] || {}} 
                type={selectedOrderForInvoice.type}
                isCustomerView={true}
                onDownloadPdf={() => {
                  window.print();
                }}
                onClose={() => setShowInvoiceModal(false)}
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
