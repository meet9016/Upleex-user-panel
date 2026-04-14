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
  Loader2,
  Minus,
  Plus,
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';
import { SuccessModal } from '@/components/features/SuccessModal';
import { motion, AnimatePresence, LayoutGroup, Variants } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { Button } from '@/components/ui/Button';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [completedOrderDetails, setCompletedOrderDetails] = useState<{
    orderId: string;
    amount: number;
    items: any[];
  } | null>(null);
  const [paymentOption, setPaymentOption] = useState<'full' | '30_percent'>('full');
  const { cartItems, loading, cartSummary, updateQuantity, removeFromCart, refreshCart, clearCart } = useCart();

  const isEmpty = cartItems.length === 0;

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

  // Handle payment
  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);

      // Check if cart is empty
      if (cartItems.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      // Check for out of stock items
      const outOfStockItems = cartItems.filter(item => 
        item.product_type_name === 'Sell' && 
        (item.is_out_of_stock || (item.available_quantity !== undefined && item.available_quantity <= 0))
      );
      
      if (outOfStockItems.length > 0) {
        const itemNames = outOfStockItems.map(item => item.name).join(', ');
        toast.error(`Please remove out of stock items from cart: ${itemNames}`);
        return;
      }

      // Check for insufficient stock
      const insufficientStockItems = cartItems.filter(item => 
        item.product_type_name === 'Sell' && 
        item.available_quantity !== undefined && 
        parseInt(item.qty) > item.available_quantity
      );
      
      if (insufficientStockItems.length > 0) {
        const itemDetails = insufficientStockItems.map(item => 
          `${item.name} (Available: ${item.available_quantity}, In Cart: ${item.qty})`
        ).join(', ');
        toast.error(`Insufficient stock for: ${itemDetails}`);
        return;
      }

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        return;
      }

      console.log('Creating order...');

      // Create order
      const orderResponse = await api.post(endPointApi.createOrder, {
        delivery_address: {
          address_line_1: '123 Main Street', // You can add address form later
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          country: 'India',
        },
        order_notes: 'Order from cart',
        payment_type: paymentOption,
      });

      console.log('Order response:', orderResponse.data);

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
        description: `Order #${data.order_id}`,
        order_id: data.razorpay_order_id,
        handler: async (response: any) => {
          try {
            console.log('Payment successful, verifying...');
            // Verify payment
            await api.post(endPointApi.verifyPayment, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: data.order_id,
            });

            toast.success('Payment successful! Your order has been confirmed.');
            
            // Clear cart after successful payment
            await clearCart();
            
            // Set order details and show success modal
            setCompletedOrderDetails({
              orderId: data.order_id,
              amount: data.amount,
              items: cartItems,
            });
            setIsSuccessModalOpen(true);
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'Customer Name', // You can get this from user context
          email: 'customer@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initiate payment';
      
      if (errorMessage.includes('Razorpay keys not configured')) {
        toast.error('Payment gateway not configured. Please contact support.');
      } else if (errorMessage.includes('Cart is empty')) {
        toast.error('Your cart is empty. Please add items to cart.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ────────────────────────────────────────────────
  // Summary Calculation 
  // ────────────────────────────────────────────────
  const summary: CartSummary | null = (() => {
    if (isEmpty || !cartSummary) return null;

    return {
      mode: 'Order Summary',
      rentLabel: 'Subtotal',
      rentAmount: parseFloat(cartSummary.subtotal),
      tax: parseFloat(cartSummary.gst_amount),
      delivery: parseFloat(cartSummary.delivery_charges),
      installation: parseFloat(cartSummary.installation_charges),
      deposit: 0,
      dueToday: parseFloat(cartSummary.grand_total),
      totalLabel: 'Total Payable',
    };
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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        <div className="mb-6">
          <BackButton label="Continue Shopping" />
        </div>

        {/* Progress Bar */}
        {/* <motion.div variants={itemVariants} className="mb-10">
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
        </motion.div> */}

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
              <Button 
                // whileHover={{ scale: 1.05 }}
                // whileTap={{ scale: 0.95 }}
                className="mt-8 inline-flex items-center gap-2  px-8 py-3.5 rounded-xl font-medium blue transition-colors shadow-lg "
              >
                Start Shopping <ArrowRight size={18} />
              </Button>
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
                  {loading && cartItems.length === 0 ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                  ) : (
                  cartItems.map((item) => (
                    <motion.div 
                      key={item.cart_id} 
                      layout
                      className="flex flex-col sm:flex-row gap-6 group mb-8 last:mb-0"
                    >
                      {/* Image */}
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="w-full sm:w-44 h-44 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4 overflow-hidden relative"
                      >
                        <motion.img
                          src={item.image.trim().startsWith('http') ? item.image.trim() : `https://upleex.2min.cloud/${item.image.trim()}`}
                          alt={item.name}
                          width={200}
                          height={200}
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
                              ₹{parseFloat(item.price).toLocaleString('en-IN')}
                            </div>
                            {/* <div className="text-sm text-slate-500">per unit</div> */}
                          </div>
                        </div>

                          {/* Quantity and Actions */}
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                              {/* Out of Stock Badge for cart items */}
                              {item.product_type_name === 'Sell' && (item.is_out_of_stock || (item.available_quantity !== undefined && item.available_quantity <= 0)) && (
                                <div className="mb-2">
                                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    OUT OF STOCK
                                  </span>
                                </div>
                              )}
                              
                             <div className={`flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 ${
                              item.product_type_name === 'Sell' && (item.is_out_of_stock || (item.available_quantity !== undefined && item.available_quantity <= 0)) 
                                ? 'opacity-50' 
                                : ''
                            }`}>
                                <button
                                  onClick={() => {
                                    const newQty = Math.max(0, parseInt(item.qty) - 1);
                                    updateQuantity(item.id, newQty);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600 disabled:opacity-50"
                                  disabled={parseInt(item.qty) <= 1 || (item.product_type_name === 'Sell' && (item.is_out_of_stock || (item.available_quantity !== undefined && item.available_quantity <= 0)))}
                                >
                                  <Minus size={16} />
                                </button>
                                <div className="w-10 text-center font-bold text-slate-900">
                                  {item.qty}
                                </div>
                                <button
                                  onClick={() => {
                                    const currentQty = parseInt(item.qty);
                                    const isSell = item.product_type_name === 'Sell';
                                    const availableStock = item.available_quantity || 0;
                                    const isOutOfStock = item.is_out_of_stock || availableStock <= 0;
                                    
                                    // Check if out of stock
                                    if (isSell && isOutOfStock) {
                                      toast.error('This product is currently out of stock');
                                      return;
                                    }
                                    
                                    // Check stock for sell products
                                    if (isSell && currentQty >= availableStock) {
                                      toast.error(`Only ${availableStock} units available in stock`);
                                      return;
                                    }
                                    
                                    updateQuantity(item.id, currentQty + 1);
                                  }}
                                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:shadow-sm transition-all text-slate-600 disabled:opacity-50"
                                  disabled={item.product_type_name === 'Sell' && (item.is_out_of_stock || (item.available_quantity !== undefined && (item.available_quantity <= 0 || parseInt(item.qty) >= item.available_quantity)))}
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                              {/* Stock indicator for sell products */}
                              {item.product_type_name === 'Sell' && item.available_quantity !== undefined && !item.is_out_of_stock && item.available_quantity > 0 && (
                                <div className="text-xs text-center">
                                  <span className={`font-medium ${
                                    item.available_quantity <= 5 ? 'text-red-600' : 'text-orange-600'
                                  }`}>
                                    {item.available_quantity} available
                                  </span>
                                </div>
                              )}
                              {/* Out of stock message */}
                              {item.product_type_name === 'Sell' && (item.is_out_of_stock || (item.available_quantity !== undefined && item.available_quantity <= 0)) && (
                                <div className="text-xs text-center">
                                  <span className="font-medium text-red-600">
                                    Currently out of stock
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                          {/* <motion.button 
                            whileHover={{ scale: 1.05, color: '#2563eb' }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-1.5 text-sm text-slate-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
                          >
                            <Edit2 size={16} /> Edit
                          </motion.button> */}
                              <motion.button 
                                whileHover={{ scale: 1.05, color: '#dc2626' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => removeFromCart(item.cart_id)}
                                className="flex items-center gap-1.5 text-sm text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
                              >
                                <Trash2 size={16} /> Remove
                              </motion.button>
                            </div>
                          </div>

                          {/* Price Details */}
                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            {[
                               // { label: 'Subtotal', value: `₹${parseFloat(item.sub_total).toLocaleString('en-IN')}` },
                              { label: 'Final Amount', value: `₹${parseFloat(item.final_amount).toLocaleString('en-IN')}` },
                            ].map((d) => (
                              <div
                                key={d.label}
                                className="bg-slate-50/50 rounded-lg px-3 py-2 border border-slate-100"
                              >
                                <div className="text-[10px] text-slate-500 font-bold">
                                  {d.label}
                                </div>
                                <div className="font-bold text-slate-900 mt-0.5">{d.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>

              {/* Payment Plan Selector */}
              {/* <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
              </motion.div> */}
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
                      // onClick={() => setIsPaymentModalOpen(true)}
                      onClick={() => handlePayment()}
                      disabled={isProcessingPayment}
                      whileHover={{ scale: isProcessingPayment ? 1 : 1.02, boxShadow: isProcessingPayment ? undefined : "0 20px 25px -5px rgb(59 130 246 / 0.4)" }}
                      whileTap={{ scale: isProcessingPayment ? 1 : 0.98 }}
                      className={`mt-6 w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group transition-all ${
                        isProcessingPayment 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30 hover:shadow-blue-500/40'
                      }`}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center gap-2">
                            Proceed to Checkout <ArrowRight size={20} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </>
                      )}
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

      {/* Payment Options Modal */}
      {/* <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100"
            >
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800">Choose Payment Option</h2>
                <p className="text-slate-500 mt-1 text-sm">
                  Select how you would like to pay for your order.
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => setPaymentOption('full')}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 group relative overflow-hidden ${
                    paymentOption === 'full' 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-100' 
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-semibold ${paymentOption === 'full' ? 'text-blue-900' : 'text-slate-700'}`}>Pay Full Amount</span>
                    {paymentOption === 'full' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-blue-600 text-white rounded-full p-1 shadow-md">
                        <Check size={14} strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${paymentOption === 'full' ? 'text-blue-700 font-medium' : 'text-slate-500'}`}>
                    ₹{(summary?.dueToday || 0).toLocaleString('en-IN')}
                  </div>
                </button>

                <button
                  onClick={() => setPaymentOption('30_percent')}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all duration-200 group relative overflow-hidden ${
                    paymentOption === '30_percent' 
                      ? 'border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-100' 
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                       <span className={`font-semibold ${paymentOption === '30_percent' ? 'text-blue-900' : 'text-slate-700'}`}>Pay 30% Advance</span>
                       <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Partial Pay</span>
                    </div>
                    {paymentOption === '30_percent' && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-blue-600 text-white rounded-full p-1 shadow-md">
                        <Check size={14} strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${paymentOption === '30_percent' ? 'text-blue-700 font-medium' : 'text-slate-500'}`}>
                    Pay ₹{Math.round((summary?.dueToday || 0) * 0.3).toLocaleString('en-IN')} now, rest later
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl border-2 border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                  disabled={isProcessingPayment}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    handlePayment();
                  }}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/30 flex justify-center items-center gap-2 transition-all active:scale-[0.98]"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? <Loader2 className="animate-spin" size={18} /> : 'Proceed to Pay'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence> */}

      {/* Success Modal */}
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        orderDetails={completedOrderDetails}
        onClose={() => {
          setIsSuccessModalOpen(false);
          // Refresh cart to ensure count is updated
          refreshCart();
        }}
      />
    </motion.div>
  );
}