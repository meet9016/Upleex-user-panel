'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NavigationButtons } from '@/components/features/NavigationButtons';
import { Calendar, Package, Clock, Eye, Tag, AlertCircle } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { StatusBadge } from '@/components/ui/StatusBadge';

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
}

const UserQuotesPage = () => {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const response = await api.get('/quote/getall');
      if (response.data.success) {
        const filtered = (response.data.data || []).filter((quote: any) => {
          const isPaid = String(quote.payment_status || '').toLowerCase() === 'paid';
          const isComplete = String(quote.status || '').toLowerCase() === 'complete';
          return !(isPaid && isComplete);
        });
        setQuotes(filtered);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast.error('Failed to fetch quotes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);


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
          <div className="text-center py-16">
            <Package className="mx-auto h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No quotes found</h2>
            <p className="mt-2 text-gray-500 text-sm">You haven't requested any quotes yet.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {quotes.map((quote) => {
              const product = quote.product_id || {};
                          
              return (
              <div key={quote._id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                            
                {/* Header */}
                <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-start gap-3">
                    <img
                      src={product.product_main_image || ''}
                      alt={product.product_name || 'Product'}
                      className="w-12 h-12 rounded-md object-cover border border-gray-200 flex-shrink-0 bg-gray-50 text-[8px] flex items-center justify-center overflow-hidden"
                      onError={(e: any) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-bold text-gray-900 line-clamp-1 leading-tight">
                          {product.product_name || '-'}
                        </h3>
                        <div className="flex items-end gap-1.5">
                          <StatusBadge status={quote.status} label="Quote Status" />
                          {quote.payment_status && (
                            <StatusBadge status={quote.payment_status} label="Payment" />
                          )}
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-500  truncate font-bold">
                        {product.vendor_name || '-'}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-bold">
                        {product.category_name || '-'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Section - UNIFORM WIDTH ITEMS */}
                <div className="p-3 flex-1">
                  
                  {/* Flex container with wrapping. Each item is fixed width (w-[90px]). */}
                  <div className="flex flex-wrap gap-x-2 gap-y-2">
                    
                    {/* 1. Quantity */}
                    <div className="w-[90px] flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold ">Qty</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {/* <Package className="h-3 w-3 text-blue-500 flex-shrink-0" /> */}
                        <span className="text-xs font-semibold text-gray-800 truncate">{quote.qty}</span>
                      </div>
                    </div>

                    {/* 2. Total Price */}
                    {quote.calculated_price && (
                      <div className="w-[90px] flex flex-col">
                      <span className="text-[11px] text-gray-400 font-bold ">Total</span>
                      <div className="flex flex-col mt-0.5 min-w-0">
                        <span className="text-xs font-bold text-gray-900">₹{Number(quote.calculated_price).toLocaleString()}</span>
                        <span className="text-[10px] text-gray-400 font-bold">₹{Number(product.price || 0).toLocaleString()} × {quote.qty}</span>
                      </div>
                    </div>
                    )}

                    {/* 3. Start Date */}
                    {quote.start_date && (
                      <div className="w-[90px] flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold ">Start</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="text-[11px] font-medium text-gray-700 truncate">{formatDate(quote.start_date)}</span>
                        </div>
                      </div>
                    )}

                    {/* 4. End Date */}
                    {quote.end_date && (
                      <div className="w-[90px] flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold ">End</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="text-[11px] font-medium text-gray-700 truncate">{formatDate(quote.end_date)}</span>
                        </div>
                      </div>
                    )}

                    {/* 5. Start Time */}
                    {quote.start_time && (
                      <div className="w-[90px] flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold ">Time</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="text-[11px] text-gray-700 truncate">{quote.start_time}</span>
                        </div>
                      </div>
                    )}

                    {/* 6. End Time */}
                    {quote.end_time && (
                      <div className="w-[90px] flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold ">End T</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="text-[11px] text-gray-700 truncate">{quote.end_time}</span>
                        </div>
                      </div>
                    )}

                    {/* 7. Plan */}
                    {quote.month_name && (
                      <div className="w-[90px] flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold ">Plan</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-purple-500 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-800 truncate">{quote.month_name}</span>
                        </div>
                      </div>
                    )}

                    {/* Fallback Delivery */}
                    {quote.delivery_date && !quote.start_date && (
                       <div className="w-[90px] flex flex-col">
                        <span className="text-[11px] text-gray-400 font-bold ">Delivery</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
                          <span className="text-[11px] font-medium text-gray-700 truncate">{formatDate(quote.delivery_date)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Note Section */}
                  {quote.note && (
                    <div className="mt-3 pt-2 border-t border-dashed border-gray-100 flex items-start gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[9px] text-amber-700 font-bold ">Note</p>
                        <p className="text-[11px] text-gray-700 leading-snug line-clamp-2">{quote.note}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-3.5 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">
                      #{quote._id.slice(-6).toUpperCase()}
                    </span>
                    {quote.payment_status?.toLowerCase() !== 'paid' && quote.razorpay_payment_link && (
                      <a 
                        href={quote.razorpay_payment_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] font-black text-white bg-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Pay
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => router.push(`/browse-ads/${quote.product_id._id}`)}
                    className="text-[11px] cursor-pointer font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    View Product <Eye className="h-3 w-3" />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserQuotesPage;
