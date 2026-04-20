'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { Calendar, Package, Clock, Eye, Tag, AlertCircle } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SuccessModal } from '@/components/features/SuccessModal';
import { Pagination } from '@/components/ui/Pagination';
import endPointApi from '@/utils/endPointApi';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Quote {
  _id: string;
  product_id: {
    _id: string;
    product_name: string;
    product_main_image: string;
    category_name: string;
    sub_category_name: string;
    vendor_name: string;
    price: string;
    product_listing_type_name?: string;
  };
  delivery_date: string;
  number_of_days: number;
  months_id: string;
  qty: number;
  note: string;
  status: string;
  payment_status?: string;
  razorpay_payment_link?: string;
  createdAt: string;
  calculated_price?: number;
  month_name?: string;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  isNew?: boolean;
}

const UserQuotesPage = () => {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<{
    orderId: string;
    amount: number;
    items: any[];
  } | null>(null);
  const [processingQuoteId, setProcessingQuoteId] = useState<string | null>(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/quote/getall?view_type=quote&page=${page}&limit=10`);
      if (response.data.success) {
        setQuotes(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      toast.error('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [page]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle quote payment
  const handleQuotePayment = async (quoteId: string, quote: Quote) => {
    try {
      setProcessingQuoteId(quoteId);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        return;
      }

      // Create order for quote payment
      const orderResponse = await api.post(`${endPointApi.quoteCreateOrder}`, {
        quote_id: quoteId,
        amount: quote.calculated_price || quote.product_id?.price || 0,
      });

      const { data } = orderResponse.data;

      if (!data.razorpay_order_id) {
        throw new Error('Failed to create Razorpay order');
      }

      // Razorpay options
      const options = {
        key: data.key,
        amount: data.amount * 100, // Amount in paise
        currency: data.currency,
        name: 'Upleex',
        description: `Quote #${quote._id}`,
        order_id: data.razorpay_order_id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await api.post('/quote/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              quote_id: quoteId,
            });

            toast.success('Payment successful! Quote confirmed.');
            
            // Set order details and show success modal
            setCompletedOrderDetails({
              orderId: quote._id,
              amount: quote.calculated_price || 0,
              items: [
                {
                  name: quote.product_id?.product_name,
                  qty: quote.qty,
                  price: quote.product_id?.price,
                  image: quote.product_id?.product_main_image,
                }
              ],
            });
            setIsSuccessModalOpen(true);
            
            // Refresh quotes after successful payment
            await fetchQuotes();
          } catch (error: any) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
          toast('Payment cancelled');
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initiate payment';
      toast.error(errorMessage);
    } finally {
      setProcessingQuoteId(null);
    }
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <NavigationButtons />
        
        {quotes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm mt-4">
            <Package className="mx-auto h-20 w-20 text-gray-200 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900">No quotes found</h3>
            <p className="text-gray-500 mt-2 font-medium">You haven't requested any quotes yet.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {quotes.map((quote) => {
              const product = quote.product_id || {};
                          
              return (
                <div key={quote._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                  {/* Order Header */}
                  <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50">
                    <div>
                      <p className="font-semibold text-gray-900">Quote ID: #{quote._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(quote.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <StatusBadge status={quote.status} label="Quote" />
                      {quote.payment_status && (
                        <StatusBadge status={quote.payment_status} label="Payment" />
                      )}
                    </div>
                  </div>

                  {/* Order Item */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-20 h-20 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                        <img
                          src={product.product_main_image?.startsWith('http') 
                            ? product.product_main_image 
                            : `https://upleex.2min.cloud/${product.product_main_image}`}
                          alt={product.product_name || 'Product'}
                          className="w-full h-full object-contain p-1"
                          onError={(e: any) => { 
                            e.currentTarget.onerror = null; 
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight mb-1">
                              {product.product_name || '-'}
                            </h3>
                            <p className="text-xs text-gray-500 font-medium">
                              {product.vendor_name || '-'} • {product.category_name || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                          {/* Qty */}
                          <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Qty</span>
                            <span className="text-xs font-semibold text-gray-800">{quote.qty}</span>
                          </div>

                          {/* Price details if available */}
                          {quote.calculated_price && (
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Price</span>
                              <span className="text-xs font-semibold text-gray-800">
                                ₹{Number(product.price || 0).toLocaleString()} × {quote.qty}
                              </span>
                            </div>
                          )}

                          {/* Dates */}
                          {(quote.start_date || quote.delivery_date) && (
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                {quote.start_date ? 'Start' : 'Delivery'}
                              </span>
                              <span className="text-xs font-semibold text-gray-800">
                                {formatDate(quote.start_date || quote.delivery_date)}
                              </span>
                            </div>
                          )}

                          {quote.end_date && (
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">End</span>
                              <span className="text-xs font-semibold text-gray-800">{formatDate(quote.end_date)}</span>
                            </div>
                          )}

                          {quote.month_name && (
                            <div className="flex flex-col">
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Plan</span>
                              <span className="text-xs font-semibold text-gray-800">{quote.month_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Note Section - Simplified */}
                    {quote.note && (
                      <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                        <div className="flex flex-wrap items-baseline gap-1.5">
                          <span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider shrink-0">Note:</span>
                          <p className="text-xs text-gray-600 leading-snug">{quote.note}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm mt-auto">
                    <div>
                      <span className="font-medium text-gray-900">Total Amount: </span>
                      <span className="font-bold text-lg text-blue-600">
                        ₹{(quote.calculated_price || Number(product.price || 0) * quote.qty).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => router.push(`/browse-ads/${quote.product_id._id}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        View Product <Eye className="h-3.5 w-3.5" />
                      </button>
                      
                      {quote.payment_status?.toLowerCase() !== 'paid' &&
                      quote.status?.toLowerCase() !== 'pending' &&
                      quote.status?.toLowerCase() !== 'reject' && (
                        <button
                          onClick={() => handleQuotePayment(quote._id, quote)}
                          disabled={processingQuoteId === quote._id}
                          className="px-6 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                          {processingQuoteId === quote._id ? 'Processing...' : 'Pay Now'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Pagination */}
          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>

      <SuccessModal 
        isOpen={isSuccessModalOpen}
        orderDetails={completedOrderDetails}
        onClose={() => {
          setIsSuccessModalOpen(false);
          setCompletedOrderDetails(null);
        }}
      />
    </div>
  );
};

export default UserQuotesPage;
