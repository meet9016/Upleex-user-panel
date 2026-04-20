'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock,
  ShoppingBag, 
  XCircle, 
  Package, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';

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
    counts?: {
      currentRentals: number;
      pastRentals: number;
      purchases: number;
      cancellations: number;
    };
    purchases_total_amount?: number;
  } | null;
  loading: boolean;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ dashboardData, loading }) => {
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'purchases' | 'cancellations'>('current');

  const currentRentals = dashboardData?.currentRentals || [];
  const pastRentals = dashboardData?.pastRentals || [];
  const purchases = dashboardData?.purchases || [];
  const cancellations = dashboardData?.cancellations || [];

  // Use counts from backend if available, otherwise fallback to array length
  const counts = dashboardData?.counts || {
    currentRentals: currentRentals.length,
    pastRentals: pastRentals.length,
    purchases: purchases.length,
    cancellations: cancellations.length,
  };

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

  const tabs = [
    { id: 'current', label: 'Current Rentals', icon: Clock, count: counts.currentRentals },
    { 
      id: 'purchases', 
      label: 'Purchases', 
      icon: ShoppingBag, 
      count: counts.purchases,
      amount: `₹${formatPrice(dashboardData?.purchases_total_amount || 0)}`
    },
    { id: 'cancellations', label: 'Cancellations', icon: XCircle, count: counts.cancellations },
  ] as const;

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    // If the dates are invalid, return 0
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
    
    const diffTime = Math.abs(e.getTime() - s.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // At least 1 day if dates are same
  };

  const renderOrderCard = (rental: Rental) => {
    const isSell = (rental.product_id?.product_type_name || '').toLowerCase() === 'sell';
    const status = (rental.status || '').toLowerCase();
    const paymentStatus = (rental.payment_status || '').toLowerCase();

    // Fallback: if product_id is missing price (common for past orders where reference is lost), calculate it from total
    const unitPrice = rental.product_id?.price ? rental.product_id.price : (rental.calculated_price / (rental.qty || 1));

    return (
      <motion.div
        key={rental._id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full"
      >
        {/* Card Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50">
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {isSell ? 'Order' : 'Rental'} ID: #{rental._id.slice(-6).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(rental.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={status} label="Order" />
            <StatusBadge status={paymentStatus || 'pending'} label="Payment" />
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1">
          <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="w-16 h-16 bg-white rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
              <img
                src={rental.product_id?.product_main_image?.startsWith('http') 
                  ? rental.product_id.product_main_image 
                  : `https://upleex.2min.cloud/${rental.product_id?.product_main_image}`}
                alt={rental.product_id?.product_name}
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 line-clamp-2 text-sm leading-tight mb-1">
                {rental.product_id?.product_name}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                <span>Qty: {rental.qty}</span>
                <span>•</span>
                <span>₹{formatPrice(unitPrice)} / unit</span>
              </div>

              {/* Purchase/Rental Label */}
              <div className={`mt-2 flex items-center gap-1.5 text-[10px] font-bold w-fit px-2 py-0.5 rounded-md border ${
                isSell 
                ? 'text-orange-600 bg-orange-50 border-orange-100' 
                : 'text-blue-600 bg-blue-50 border-blue-100'
              }`}>
                {isSell ? <ShoppingBag size={10} /> : <Calendar size={10} />}
                <span>{isSell ? 'Purchase' : 'Rental'}</span>
              </div>
             {/* Rental Dates if not Sell */}
          {!isSell && (rental.start_date || rental.end_date) && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-blue-700  px-2.5 py-1.5 rounded-lg  flex-1">
                <Calendar size={12} className="text-blue-500" />
                <div className="flex items-center gap-1.5">
                  <span>{rental.start_date ? new Date(rental.start_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'N/A'}</span>
                  <span className="text-gray-400 text-[10px]">→</span>
                  <span>{rental.end_date ? new Date(rental.end_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'N/A'}</span>
                </div>
              </div>
              {rental.start_date && rental.end_date && (
                <span className="text-[10px] font-bold px-2.5 py-1.5 bg-blue-600 text-white rounded-lg shadow-sm">
                  {calculateDays(rental.start_date, rental.end_date)} DAYS
                </span>
              )}
            </div>
          )}
            </div>
          </div>

         
        </div>

        {/* Card Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-gray-900">Total: </span>
            <span className="text-base font-bold text-blue-600">₹{formatPrice(rental.calculated_price)}</span>
          </div>
          
          {activeTab !== 'cancellations' && paymentStatus !== 'paid' && rental.razorpay_payment_link && (
            <a 
              href={rental.razorpay_payment_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              Pay Now
            </a>
          )}
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
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`p-4 rounded-2xl border transition-all text-left group cursor-pointer ${
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
           <p className={`text-lg font-bold mb-1 flex items-center justify-between ${
  activeTab === tab.id ? 'text-blue-50' : 'text-gray-400'
}`}>
  {tab.label}

  {'amount' in tab && (
    <span className={`text-[20px] font-bold ${
      activeTab === tab.id ? 'text-blue-100' : 'text-blue-600'
    }`}>
      {tab.amount}
    </span>
  )}
</p>
            <div className="flex items-end justify-between">
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black">{tab.count}</span>
              </div>
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
