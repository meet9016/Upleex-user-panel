'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  Info, 
  Lock, 
  MessageCircle, 
  Trash2, 
  Edit2, 
  Check, 
  Calendar, 
  CreditCard, 
  Wallet,
  ShoppingBag,
  MapPin,
  CreditCard as PaymentIcon,
  Tag,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type PaymentPlan = 'monthly' | 'full' | 'upfront';

interface CartItem {
  id: string;
  name: string;
  image: string;
  monthlyRent: number;
  tenure: number; // months
  quantity: number;
  startDate: string;
  deposit: number;
  deliveryCharge: number;
  installationCharge: number;
}

export default function CartPage() {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>('monthly');
  const [couponCode, setCouponCode] = useState('');
  
  // Mock Cart Data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: '25 LTR Geyser',
      image: '/Asset-32.webp', // Using actual asset
      monthlyRent: 900,
      tenure: 12,
      quantity: 1,
      startDate: '09 Feb 2026',
      deposit: 1000,
      deliveryCharge: 500,
      installationCharge: 300,
    }
  ]);

  // Calculations
  const item = cartItems[0];
  const isEmpty = !item;

  const calculateSummary = () => {
    if (!item) return null;
    
    const rentPerMonth = item.monthlyRent * item.quantity;
    const totalRent = rentPerMonth * item.tenure;
    const taxRate = 0.18;
    
    // Base charges
    const delivery = item.deliveryCharge;
    const installation = item.installationCharge;

    if (selectedPlan === 'monthly') {
      const tax = rentPerMonth * taxRate;
      const totalDue = rentPerMonth + tax + delivery + installation + item.deposit;
      return {
        mode: 'Monthly (With Deposit)',
        rentLabel: 'Monthly Rent',
        rentAmount: rentPerMonth,
        tax,
        delivery,
        installation,
        deposit: item.deposit,
        dueToday: totalDue,
        totalAmount: null,
        totalLabel: 'Due Today'
      };
    } else {
      // Full or Upfront
      const tax = totalRent * taxRate;
      const totalAmount = totalRent + tax + delivery + installation;
      return {
        mode: selectedPlan === 'full' ? 'No Cost EMI' : 'Pay Upfront',
        rentLabel: 'Total Rent',
        rentAmount: totalRent,
        tax,
        delivery,
        installation,
        deposit: 0,
        dueToday: totalAmount,
        totalAmount: totalAmount,
        totalLabel: 'Total Amount'
      };
    }
  };

  const summary = calculateSummary();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* <Navbar /> */}
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Progress Stepper */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center max-w-3xl mx-auto">
            {[
              { id: 1, label: 'Cart', icon: ShoppingBag, active: true, completed: false },
              { id: 2, label: 'Address', icon: MapPin, active: false, completed: false },
              { id: 3, label: 'Payment', icon: PaymentIcon, active: false, completed: false },
            ].map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    step.active 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-110' 
                      : step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                    <step.icon size={18} />
                  </div>
                  <span className={`mt-2 text-xs font-semibold uppercase tracking-wider ${
                    step.active ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className="h-[2px] w-24 md:w-48 bg-gray-200 -mt-6 mx-2 relative">
                    <div className="absolute top-0 left-0 h-full bg-blue-600 transition-all duration-500" style={{ width: step.completed ? '100%' : '0%' }}></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {isEmpty ? (
           <div className="text-center py-20">
             <h2 className="text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
             <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">Continue Shopping</Link>
           </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              
              {/* Payment Plan Selection */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                        <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                        Select Payment Plan
                      </h2>
                      {/* <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                          <Info size={14} /> How it works?
                      </button> */}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Pay Monthly */}
                      <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPlan('monthly')}
                          className={`relative cursor-pointer border rounded-xl p-3 transition-all duration-300 ${
                              selectedPlan === 'monthly' 
                              ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20' 
                              : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
                          }`}
                      >
                          {selectedPlan === 'monthly' && (
                              <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -top-2 right-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-green-500/20 flex items-center gap-1"
                              >
                                <Check size={8} strokeWidth={4} /> POPULAR
                              </motion.div>
                          )}
                          <div className="flex flex-row items-center gap-3">
                              <div className={`p-2 rounded-full shrink-0 ${selectedPlan === 'monthly' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Calendar size={18} />
                              </div>
                              <div className="text-left">
                                  <div className={`font-bold text-sm ${selectedPlan === 'monthly' ? 'text-blue-900' : 'text-gray-700'}`}>Pay Monthly</div>
                                  <div className="text-[10px] text-gray-500 font-medium leading-tight">With Security Deposit</div>
                              </div>
                          </div>
                      </motion.div>

                      {/* Pay Full */}
                      <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPlan('full')}
                          className={`relative cursor-pointer border rounded-xl p-3 transition-all duration-300 ${
                              selectedPlan === 'full' 
                              ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20' 
                              : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
                          }`}
                      >
                          <div className="flex flex-row items-center gap-3">
                              <div className={`p-2 rounded-full shrink-0 ${selectedPlan === 'full' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <CreditCard size={18} />
                              </div>
                              <div className="text-left">
                                  <div className={`font-bold text-sm ${selectedPlan === 'full' ? 'text-blue-900' : 'text-gray-700'}`}>Pay Full</div>
                                  <div className="text-[10px] text-gray-500 font-medium leading-tight">No Cost EMI Available</div>
                              </div>
                          </div>
                      </motion.div>

                      {/* Pay Upfront */}
                      <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedPlan('upfront')}
                          className={`relative cursor-pointer border rounded-xl p-3 transition-all duration-300 ${
                              selectedPlan === 'upfront' 
                              ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600/20' 
                              : 'border-gray-100 hover:border-blue-200 hover:shadow-md'
                          }`}
                      >
                           {selectedPlan === 'upfront' && (
                              <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute -top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-orange-500/20"
                              >
                                  SAVE MORE
                              </motion.div>
                          )}
                          <div className="flex flex-row items-center gap-3">
                              <div className={`p-2 rounded-full shrink-0 ${selectedPlan === 'upfront' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Wallet size={18} />
                              </div>
                              <div className="text-left">
                                  <div className={`font-bold text-sm ${selectedPlan === 'upfront' ? 'text-blue-900' : 'text-gray-700'}`}>Pay Upfront</div>
                                  <div className="text-[10px] text-gray-500 font-medium leading-tight">One-time payment</div>
                              </div>
                          </div>
                      </motion.div>
                  </div>
              </motion.div>

              {/* Cart Items */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/50">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-gray-800 text-base flex items-center gap-2">
                        <span className="w-1 h-5 bg-blue-600 rounded-full"></span>
                        Cart Items
                      </h2>
                      <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{cartItems.length} item</span>
                  </div>

                  {cartItems.map((item) => (
                      <div key={item.id} className="group">
                          <div className="flex flex-col sm:flex-row gap-4">
                              {/* Product Image */}
                              <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-xl flex items-center justify-center p-2 relative shrink-0 overflow-hidden group-hover:shadow-md transition-all duration-300">
                                  <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                      onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                          e.currentTarget.parentElement!.innerText = 'No Image';
                                      }}
                                  />
                              </div>

                              {/* Details */}
                              <div className="flex-1 flex flex-col justify-between py-0.5">
                                  <div>
                                      <div className="flex justify-between items-start">
                                          <div>
                                              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{item.name}</h3>
                                              <div className="text-gray-500 text-xs mt-0.5">Premium Appliance</div>
                                          </div>
                                          <div className="text-right">
                                              <div className="font-bold text-gray-900 text-lg">₹{item.monthlyRent.toFixed(2)}</div>
                                              <div className="text-[10px] text-gray-500 font-medium">/Month</div>
                                          </div>
                                      </div>

                                      <div className="flex flex-wrap gap-2 mt-2">
                                          <div className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Start Date</div>
                                              <div className="text-xs font-semibold text-gray-700">{item.startDate}</div>
                                          </div>
                                          <div className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Tenure</div>
                                              <div className="text-xs font-semibold text-gray-700">{item.tenure} Months</div>
                                          </div>
                                          <div className="bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Quantity</div>
                                              <div className="text-xs font-semibold text-gray-700">{item.quantity}</div>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="flex justify-end gap-2 mt-2 pt-2 border-t border-gray-50">
                                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                          <Edit2 size={14} /> Edit
                                      </button>
                                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                                          <Trash2 size={14} /> Remove
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  ))}
              </motion.div>

              {/* Coupons */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100/50">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2 font-bold text-gray-800">
                          <Tag className="text-blue-600" size={20} />
                          Apply Coupons
                      </div>
                      <button className="text-xs text-blue-600 font-bold hover:underline tracking-wide uppercase">View All</button>
                  </div>
                  
                  <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Enter coupon code"
                            className="w-full bg-gray-50 border-0 rounded-xl px-4 py-3 text-sm font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                        />
                      </div>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-gray-200"
                      >
                          APPLY
                      </motion.button>
                  </div>
              </motion.div>

            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-[400px]">
              <motion.div 
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden sticky top-24 border border-gray-100"
              >
                  <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                      <h2 className="font-bold text-lg mb-1 relative z-10">Order Summary</h2>
                      <div className="text-sm text-gray-400 flex items-center gap-2 relative z-10">
                          {cartItems.length} item • <span className="text-gray-300 font-medium">{summary!.mode}</span>
                      </div>
                  </div>

                  <div className="p-6">
                      {/* Cost Breakdown */}
                      <div className="space-y-4 text-sm">
                          <div className="flex justify-between text-gray-600">
                              <span>{summary!.rentLabel}</span>
                              <span className="font-semibold text-gray-900">₹{summary!.rentAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                              <span>Tax (18%)</span>
                              <span className="font-semibold text-gray-900">₹{summary!.tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                              <span>Shipping Charge</span>
                              <span className="font-semibold text-green-600">{summary!.delivery === 0 ? 'FREE' : `₹${summary!.delivery}`}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                              <span>Installation Charge</span>
                              <span className="font-semibold text-green-600">{summary!.installation === 0 ? 'FREE' : `₹${summary!.installation}`}</span>
                          </div>
                          
                          <AnimatePresence>
                            {summary!.deposit > 0 && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="flex justify-between text-gray-600 pt-3 border-t border-dashed border-gray-200"
                                >
                                    <span className="text-gray-800 font-medium">Security Deposit <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded ml-1">REFUNDABLE</span></span>
                                    <span className="font-bold text-gray-900">₹{summary!.deposit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                </motion.div>
                            )}
                          </AnimatePresence>
                      </div>

                      <div className="border-t-2 border-gray-100 mt-6 pt-4">
                          <div className="flex justify-between items-end mb-1">
                              <span className="font-bold text-gray-700">{summary!.totalLabel}</span>
                              <motion.span 
                                key={summary!.dueToday}
                                initial={{ scale: 1.2, color: '#2563EB' }}
                                animate={{ scale: 1, color: '#111827' }}
                                className="text-3xl font-extrabold text-gray-900"
                              >
                                ₹{summary!.dueToday.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                              </motion.span>
                          </div>
                          <div className="text-right text-xs text-gray-500 font-medium">
                              Inclusive of all taxes
                          </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl mt-8 flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/30"
                      >
                          Proceed to Checkout <ArrowRight size={20} strokeWidth={2.5} />
                      </motion.button>

                      <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg">
                          <Lock size={12} /> 100% Secure Payment via Razorpay
                      </div>
                  </div>
              </motion.div>

              {/* Help Section */}
              <div className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between group cursor-pointer hover:border-blue-200 transition-colors">
                  <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2.5 rounded-full group-hover:scale-110 transition-transform">
                           <MessageCircle className="text-green-600" size={20} />
                      </div>
                      <div>
                          <div className="font-bold text-gray-900 text-sm">Need Help?</div>
                          <div className="text-xs text-gray-500">Chat with our support</div>
                      </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
