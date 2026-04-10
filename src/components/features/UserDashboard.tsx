'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  ShoppingBag, 
  XCircle, 
  Package, 
  Calendar,
  ChevronRight
} from 'lucide-react';

interface Rental {
  _id: string;
  product_id: {
    _id: string;
    product_name: string;
    product_main_image: string;
    price: string | number;
    category_name?: string;
    product_type_name?: string;
  };
  qty: number;
  calculated_price: number;
  status: string;
  vendor_status?: string;
  payment_status: string;
  start_date: string;
  end_date: string;
  createdAt: string;
  razorpay_payment_link?: string;
}

interface UserDashboardProps {
  dashboardData: {
    currentRentals: Rental[];
    pastRentals: Rental[];
    purchases: Rental[];
    cancellations: Rental[];
  } | null;
  loading: boolean;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ dashboardData, loading }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'purchases' | 'cancellations'>('current');

  const currentRentals = dashboardData?.currentRentals || [];
  const pastRentals = dashboardData?.pastRentals || [];
  const purchases = dashboardData?.purchases || [];
  const cancellations = dashboardData?.cancellations || [];

  const tabs = [
    { id: 'current', label: 'Current Rentals', icon: Clock, count: currentRentals.length },
    { id: 'past', label: 'Past Rentals', icon: CheckCircle, count: pastRentals.length },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag, count: purchases.length },
    { id: 'cancellations', label: 'Cancellations', icon: XCircle, count: cancellations.length },
  ] as const;

  // Safe number parsing to avoid #NAN
  const formatPrice = (price: any) => {
    if (price === null || price === undefined) return '0';
    
    let num: number;
    if (typeof price === 'number') {
      num = price;
    } else {
      // Remove commas and other non-numeric characters except decimal point
      const cleanPrice = String(price).replace(/[^\d.]/g, '');
      num = parseFloat(cleanPrice);
    }
    
    return isNaN(num) ? '0' : num.toLocaleString('en-IN');
  };

  const renderOrderCard = (rental: Rental) => {
    const isSell = (rental.product_id?.product_type_name || '').toLowerCase() === 'sell';
    const status = (rental.status || '').toLowerCase();
    const paymentStatus = (rental.payment_status || '').toLowerCase();

    return (
      <motion.div
        key={rental._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
      >
        <div className="px-3 py-2 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {isSell ? 'Order ID' : 'Rental ID'}
            </p>
            <p className="text-xs font-black text-gray-700">#{rental._id.slice(-6).toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
            <p className="text-xs font-bold text-gray-600">
              {new Date(rental.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short'
              })}
            </p>
          </div>
        </div>

        <div className="p-3 flex-1">
          <div className="flex gap-3">
            <div className="w-14 h-14 bg-gray-50 rounded-lg flex-shrink-0 overflow-hidden border border-gray-100">
              <img
                src={rental.product_id?.product_main_image?.startsWith('http') 
                  ? rental.product_id.product_main_image 
                  : `https://upleex.2min.cloud/${rental.product_id?.product_main_image}`}
                alt={rental.product_id?.product_name}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-gray-900 truncate mb-1">
                {rental.product_id?.product_name}
              </h4>
              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                <span>Qty: {rental.qty}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>₹{formatPrice(rental.product_id?.price)}</span>
              </div>
              
              {/* Rental Dates - Only for Rentals */}
              {!isSell && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-blue-600 bg-blue-50/50 w-fit px-2 py-0.5 rounded-md border border-blue-100/50">
                  <Calendar size={10} />
                  <span>
                    {rental.start_date ? new Date(rental.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' }) : 'N/A'} - 
                    {rental.end_date ? new Date(rental.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit' }) : 'N/A'}
                  </span>
                </div>
              )}

              {/* Sell label */}
              {isSell && (
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold text-orange-600 bg-orange-50/50 w-fit px-2 py-0.5 rounded-md border border-orange-100/50">
                  <ShoppingBag size={10} />
                  <span>Purchase</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-3 py-2 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
          <div className="flex gap-1.5">
            <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-tighter ${
              (status === 'successful' || status === 'complete') ? 'bg-green-100 text-green-700' :
              (status === 'rejected' || status === 'cancelled' || status === 'reject') ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
            }`}>
              {status}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-black rounded-md uppercase tracking-tighter ${
              paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {paymentStatus || 'pending'}
            </span>
          </div>
          <div className="text-right flex items-center gap-3">
            <p className="text-sm font-black text-blue-600">₹{formatPrice(rental.calculated_price)}</p>
            {paymentStatus !== 'paid' && rental.razorpay_payment_link && (
              <a 
                href={rental.razorpay_payment_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black text-white bg-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-700 transition-colors uppercase"
              >
                Pay
              </a>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  const getActiveOrders = () => {
    switch (activeTab) {
      case 'current': return currentRentals;
      case 'past': return pastRentals;
      case 'purchases': return purchases;
      case 'cancellations': return cancellations;
      default: return [];
    }
  };

  const activeOrders = getActiveOrders();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-2xl border transition-all text-left group ${
              activeTab === tab.id
                ? 'btn-primary shadow-lg shadow-blue-200 text-white'
                : 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-md text-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
              activeTab === tab.id ? 'bg-white/20' : 'bg-blue-50 group-hover:bg-blue-100'
            }`}>
              <tab.icon className={activeTab === tab.id ? 'text-white' : 'text-blue-600'} size={20} />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
              activeTab === tab.id ? 'text-blue-50' : 'text-gray-400'
            }`}>
              {tab.label}
            </p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black">{tab.count}</span>
              <ChevronRight size={16} className={`transition-transform ${activeTab === tab.id ? 'translate-x-1' : 'text-gray-300'}`} />
            </div>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-900">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
            {activeOrders.length} {activeOrders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {activeOrders.length > 0 ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {activeOrders.map(renderOrderCard)}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gray-300" size={40} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No orders found</h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-2">
                There are no orders in this category at the moment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
