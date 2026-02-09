'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ShoppingBag,
  CreditCard as PaymentIcon,
  Calendar,
  Wallet,
  ShieldCheck,
  Lock,
  ChevronRight,
  Trash2,
  Edit2,
  Info,
  Check,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup, Variants } from 'framer-motion';

// ────────────────────────────────────────────────
// Helper Components
// ────────────────────────────────────────────────
const AnimatedPrice = ({ value }: { value: number }) => (
  <motion.span
    key={value}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    ₹{value.toLocaleString('en-IN')}
  </motion.span>
);

// ────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────
type PaymentPlan = 'monthly' | 'full' | 'upfront';

interface CartItem {
  id: string;
  name: string;
  image: string;
  monthlyRent: number;
  tenure: number;
  quantity: number;
  startDate: string;
  deposit: number;
  deliveryCharge: number;
  installationCharge: number;
}

interface CartSummary {
  mode: string;
  rentLabel: string;
  rentAmount: number;
  tax: number;
  delivery: number;
  installation: number;
  deposit: number;
  dueToday: number;
  totalLabel: string;
}

interface PlanOption {
  id: PaymentPlan;
  title: string;
  subtitle: string;
  badge: string | null;
  icon: React.ElementType;
  color: string;
  bg: string;
}

// ────────────────────────────────────────────────
// Main Component
// ────────────────────────────────────────────────
export default function CartPage() {
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan>('monthly');
  // const [couponCode, setCouponCode] = useState('');

  const cartItems: CartItem[] = [
    {
      id: '1',
      name: '25 LTR Geyser',
      image: '/Asset-32.webp',
      monthlyRent: 900,
      tenure: 12,
      quantity: 1,
      startDate: '09 Feb 2026',
      deposit: 1000,
      deliveryCharge: 500,
      installationCharge: 300,
    },
  ];

  const isEmpty = cartItems.length === 0;
  const item = cartItems[0];

  // ────────────────────────────────────────────────
  // Summary Calculation
  // ────────────────────────────────────────────────
  const summary: CartSummary | null = (() => {
    if (!item) return null;

    const rentPerMonth = item.monthlyRent * item.quantity;
    const totalRent = rentPerMonth * item.tenure;
    const taxRate = 0.18;

    const delivery = item.deliveryCharge;
    const installation = item.installationCharge;

    if (selectedPlan === 'monthly') {
      const tax = Math.round(rentPerMonth * taxRate);
      const dueToday = rentPerMonth + tax + delivery + installation + item.deposit;

      return {
        mode: 'Monthly Rental + Deposit',
        rentLabel: 'Monthly Rent',
        rentAmount: rentPerMonth,
        tax,
        delivery,
        installation,
        deposit: item.deposit,
        dueToday,
        totalLabel: 'Due Today',
      };
    } else {
      const tax = Math.round(totalRent * taxRate);
      const total = totalRent + tax + delivery + installation;

      return {
        mode: selectedPlan === 'full' ? 'No Cost EMI' : 'Pay Upfront (Save More)',
        rentLabel: 'Total Rent',
        rentAmount: totalRent,
        tax,
        delivery,
        installation,
        deposit: 0,
        dueToday: total,
        totalLabel: 'Total Payable',
      };
    }
  })();

  // ────────────────────────────────────────────────
  // Animation Variants
  // ────────────────────────────────────────────────
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } },
  };

  const plans: PlanOption[] = [
    {
      id: 'monthly',
      title: 'Monthly',
      subtitle: '₹900/mo + deposit',
      badge: 'Popular',
      icon: Calendar,
      color: 'text-blue-700',
      bg: 'bg-blue-50',
    },
    {
      id: 'full',
      title: 'No Cost EMI',
      subtitle: 'Pay full amount',
      badge: null,
      icon: CreditCard,
      color: 'text-slate-700',
      bg: 'bg-slate-50',
    },
    {
      id: 'upfront',
      title: 'Upfront',
      subtitle: 'Best savings',
      badge: 'Save More',
      icon: Wallet,
      color: 'text-purple-700',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        {/* Progress Bar */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex items-center justify-center gap-4 md:gap-12 max-w-md mx-auto">
            {[
              { label: 'Cart', active: true },
              { label: 'Address', active: false },
              { label: 'Payment', active: false },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center relative cursor-default"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: step.active ? '#2563eb' : '#f1f5f9',
                      color: step.active ? '#ffffff' : '#64748b',
                      scale: step.active ? 1.1 : 1
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm z-10 transition-colors`}
                  >
                    {i + 1}
                  </motion.div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      step.active ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
                {i < 2 && (
                  <div className="h-0.5 flex-1 max-w-[80px] bg-slate-200 rounded-full mt-5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: step.active ? '100%' : '0%' }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="h-full bg-blue-600"
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {isEmpty ? (
          <motion.div variants={itemVariants} className="text-center py-24">
            <motion.div 
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <ShoppingBag className="mx-auto h-24 w-24 text-slate-200" strokeWidth={1} />
            </motion.div>
            <h2 className="mt-6 text-2xl font-bold text-slate-800">Your cart is empty</h2>
            <p className="mt-3 text-slate-500 max-w-md mx-auto">
              Looks like you haven’t added anything yet.
            </p>
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Start Shopping <ArrowRight size={18} />
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-10">

            {/* ─── LEFT ─── Main Content ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-7">

              {/* Cart Item Card */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 pb-5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                    <ShoppingBag className="text-blue-600" size={22} />
                    Your Items ({cartItems.length})
                  </h2>
                </div>

                <div className="p-6">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      className="flex flex-col sm:flex-row gap-6 group"
                    >
                      {/* Image */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="w-full sm:w-44 h-44 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4 overflow-hidden relative"
                      >
                        <motion.img
                          src={item.image}
                          alt={item.name}
                          whileHover={{ scale: 1.1, rotate: 2 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div>
                            <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer">
                              {item.name}
                            </h3>
                            <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500">
                              <ShieldCheck size={16} className="text-green-500" />
                              Verified Product
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-700">
                              ₹{item.monthlyRent.toLocaleString('en-IN')}
                            </div>
                            <div className="text-sm text-slate-500">per month</div>
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                          {[
                            { label: 'Start', value: item.startDate },
                            { label: 'Tenure', value: `${item.tenure} mo` },
                            { label: 'Qty', value: item.quantity },
                          ].map((d) => (
                            <motion.div
                              whileHover={{ y: -2, backgroundColor: '#f8fafc' }}
                              key={d.label}
                              className="bg-slate-50 rounded-lg px-3 py-2.5 text-center border border-slate-100 cursor-default"
                            >
                              <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">
                                {d.label}
                              </div>
                              <div className="font-medium text-slate-800 mt-0.5">{d.value}</div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3 justify-end">
                          <motion.button 
                            whileHover={{ scale: 1.05, color: '#2563eb' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 text-sm text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 size={16} /> Edit
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05, color: '#dc2626' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 text-sm text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 size={16} /> Remove
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Payment Plan Selector */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-3">
                    <PaymentIcon className="text-blue-600" size={22} />
                    Payment Plan
                  </h2>
                </div>

                <div className="p-6 grid sm:grid-cols-3 gap-4">
                  <LayoutGroup>
                  {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    return (
                    <motion.button
                      key={plan.id}
                      layout
                      onClick={() => setSelectedPlan(plan.id)}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-300 text-left group h-full flex flex-col
                        ${isSelected ? 'border-transparent bg-blue-50/30' : 'border-slate-100 hover:border-blue-200 bg-white'}`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="active-plan-border"
                          className="absolute -inset-[2px] border-2 border-blue-500 rounded-xl pointer-events-none"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {isSelected && (
                        <motion.div 
                          layoutId="selected-check"
                          className="absolute -top-2.5 -right-2.5 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10"
                        >
                          <Check size={12} strokeWidth={3} /> Selected
                        </motion.div>
                      )}

                      {plan.badge && (
                        <div
                          className={`absolute -top-2.5 left-4 px-2.5 py-1 text-xs font-bold rounded-full shadow-sm z-10 ${
                            plan.id === 'upfront' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
                          }`}
                        >
                          {plan.badge}
                        </div>
                      )}

                      <div className={`p-3 rounded-lg inline-block mb-3 ${plan.bg} ${plan.color}`}>
                        <plan.icon size={22} />
                      </div>

                      <div className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>{plan.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{plan.subtitle}</div>
                    </motion.button>
                  )})} 
                  </LayoutGroup>
                </div>
              </motion.div>
            </div>

            {/* ─── RIGHT ─── Sticky Summary ───────────────────────────────────── */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">

                <motion.div 
                  className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-6 bg-slate-50/50 border-b border-slate-100 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
                      <ShoppingBag size={22} className="text-blue-600" />
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6 space-y-4 text-sm">
                    <div className="flex justify-between text-slate-700">
                      <span>{summary?.rentLabel}</span>
                      <span className="font-semibold flex items-center">
                        <AnimatedPrice value={summary?.rentAmount || 0} />
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700">
                      <span>GST (18%)</span>
                      <span className="font-semibold flex items-center">
                        <AnimatedPrice value={summary?.tax || 0} />
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700">
                      <span>Delivery</span>
                      <span className="text-green-600 font-medium">
                        {summary?.delivery === 0 ? 'FREE' : `₹${summary?.delivery}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-700">
                      <span>Installation</span>
                      <span className="text-green-600 font-medium">
                        {summary?.installation === 0 ? 'FREE' : `₹${summary?.installation}`}
                      </span>
                    </div>

                    <AnimatePresence mode="wait">
                      {(summary?.deposit ?? 0) > 0 && (
                        <motion.div
                          key="deposit-row"
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="pt-3 border-t border-dashed border-slate-200 flex justify-between items-start overflow-hidden"
                        >
                          <div>
                            <div className="font-medium text-slate-800 flex items-center gap-1.5">
                              Refundable Deposit
                              <Info size={14} className="text-slate-400" />
                            </div>
                            <div className="text-xs text-blue-600">100% refund on return</div>
                          </div>
                          <span className="font-semibold">
                            ₹{(summary?.deposit ?? 0).toLocaleString('en-IN')}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="border-t-2 border-slate-100 pt-5 mt-5">
                      <div className="flex justify-between items-baseline">
                        <span className="text-lg font-semibold text-slate-900">
                          {summary?.totalLabel}
                        </span>
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center">
                          <AnimatedPrice value={summary?.dueToday || 0} />
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 text-right">
                        Inclusive of all taxes
                      </div>
                    </div>

                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(59 130 246 / 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Proceed to Checkout <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </motion.button>

                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-4">
                      <Lock size={14} className="text-green-500" />
                      Secure checkout via Razorpay
                    </div>
                  </div>
                </motion.div>

                {/* Help card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 flex items-center justify-between group cursor-pointer shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <MessageCircle className="text-blue-600" size={22} />
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">Need help?</div>
                      <div className="text-xs text-slate-600">Chat with us</div>
                    </div>
                  </div>
                  <ChevronRight
                    className="text-blue-600 group-hover:translate-x-1 transition-transform"
                    size={20}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}