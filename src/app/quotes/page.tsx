'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/ui/BackButton';
import { Calendar, Package, Clock, MapPin, FileText, Eye } from 'lucide-react';
import { api } from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

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
    month_arr?: any[];
  };
  delivery_date: string;
  number_of_days: number;
  months_id: string;
  qty: number;
  note: string;
  status: string;
  createdAt: string;
  calculated_price?: number;
  price_details?: any;
  month_name?: string;
}

const UserQuotesPage = () => {
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = async () => {
    try {
      const response = await api.get('/quote/getall');
      if (response.data.success) {
        setQuotes(response.data.data || []);
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'approval':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
      case 'reject':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
      case 'complete':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">My Quote Requests</h1>
          <p className="text-gray-600 mt-2">Track your product quote requests and their status</p>
        </div>

        {quotes.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-24 w-24 text-gray-300" />
            <h2 className="mt-6 text-2xl font-bold text-gray-900">No quotes found</h2>
            <p className="mt-2 text-gray-600">
              You haven't requested any quotes yet. Browse products and request quotes to get started.
            </p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <div key={quote._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={quote.product_id.product_main_image || '/placeholder-image.jpg'}
                          alt={quote.product_id.product_name}
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={(e: any) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {quote.product_id.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {quote.product_id.category_name} • {quote.product_id.sub_category_name}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Vendor: {quote.product_id.vendor_name}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(quote.status)}`}>
                        {quote.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(quote.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Quantity</p>
                        <p className="text-sm font-medium text-gray-900">{quote.qty} units</p>
                      </div>
                    </div>

                    {quote.delivery_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Delivery Date</p>
                          <p className="text-sm font-medium text-gray-900">{formatDate(quote.delivery_date)}</p>
                        </div>
                      </div>
                    )}

                    {quote.number_of_days > 0 && (
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">No of Days</p>
                          <p className="text-sm font-medium text-gray-900">{quote.number_of_days} days</p>
                        </div>
                      </div>
                    )}

                    {quote.month_name && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Plan</p>
                          <p className="text-sm font-medium text-gray-900">{quote.month_name}</p>
                        </div>
                      </div>
                    )}

                    {quote.calculated_price && (
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Total Price</p>
                          <p className="text-sm font-medium text-gray-900">₹{Number(quote.calculated_price).toLocaleString()}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {quote.note && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Note</p>
                          <p className="text-sm text-gray-700">{quote.note}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Quote ID: {quote._id.slice(-8).toUpperCase()}
                    </div>
                    <button
                      onClick={() => router.push(`/browse-ads/${quote.product_id._id}`)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Product
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserQuotesPage;