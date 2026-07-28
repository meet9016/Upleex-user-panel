'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Truck, Package, Clock, MapPin,
  ShoppingCart, PackageCheck, Copy, Check,
  AlertCircle, TrendingUp, X, RotateCcw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface TrackingStep {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  current: boolean;
}

interface OrderTrackingProps {
  orderId: string;
  status: string;
  deliveryStatus?: string;
  trackingNumber?: string;
  courierPartner?: string;
  deliveryUpdates?: Array<{
    status: string;
    message?: string;
    timestamp?: string;
    date?: string;
    location?: string;
  }>;
  onClose?: () => void;
}

const shiprocketToUserStatus: Record<string, string> = {
  'New': 'ready_to_ship',
  'Ready to Ship': 'ready_to_ship',
  'Label Generated': 'ready_to_ship',
  'AWB Assigned': 'ready_to_ship',
  'Pickup Generated': 'pickup_scheduled',
  'Pickup Scheduled': 'pickup_scheduled',
  'Pickup Queued': 'pickup_scheduled',
  'Manifest Generated': 'pickup_scheduled',
  'Shipped': 'picked_up',
  'In Transit': 'picked_up',
  'Picked Up': 'picked_up',
  'Out For Delivery': 'out_for_delivery',
  'Delivered': 'delivered',
  'Failed Delivery': 'undelivered',
  'NDR': 'undelivered',
  'RTO Initiated': 'rto_initiated',
  'RTO In Transit': 'rto_initiated',
  'RTO Delivered': 'rto_delivered',
  'Cancelled': 'cancelled',
  'Canceled': 'cancelled',
};

// User-friendly label for each effectiveStatus
const userStatusLabel: Record<string, string> = {
  pending: 'Pending',
  ready_to_ship: 'Ready to Ship',
  pickup_scheduled: 'Pickup Scheduled',
  picked_up: 'Picked Up',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  undelivered: 'Undelivered',
  rto_initiated: 'RTO Initiated',
  rto_delivered: 'RTO Delivered',
  cancelled: 'Cancelled',
};

const STATUS_ORDER = ['pending', 'ready_to_ship', 'pickup_scheduled', 'picked_up', 'out_for_delivery', 'delivered'];

const TERMINAL_STATUSES = ['cancelled', 'rto_delivered', 'rto_initiated', 'undelivered'];

const OrderTracking: React.FC<OrderTrackingProps> = ({
  orderId,
  status,
  deliveryStatus,
  trackingNumber,
  courierPartner,
  deliveryUpdates = [],
  onClose
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const vendorToUserStatus: Record<string, string> = {
    pending: 'pending',
    accepted: 'ready_to_ship',
    preparing: 'ready_to_ship',
    ready_for_pickup: 'pickup_scheduled',
    picked_up: 'picked_up',
    out_for_delivery: 'out_for_delivery',
    delivered: 'delivered',
    completed: 'delivered',
    cancelled: 'cancelled',
    returned: 'rto_delivered',
  };

  const resolvedVendor = vendorToUserStatus[status] ?? status;
  
  const normalize = (str: string | null | undefined) => String(str || '').toLowerCase().trim().replace(/_/g, ' ');
  const normalizedShiprocket = deliveryStatus ? normalize(deliveryStatus) : null;
  const resolvedShiprocket = normalizedShiprocket 
    ? (Object.entries(shiprocketToUserStatus).find(([k]) => normalize(k) === normalizedShiprocket)?.[1] ?? null) 
    : null;

  // Shiprocket terminal status always wins over non-terminal vendor status
  // Vendor terminal status always wins over non-terminal Shiprocket status
  const effectiveStatus = (() => {
    if (resolvedShiprocket && TERMINAL_STATUSES.includes(resolvedShiprocket)) return resolvedShiprocket;
    if (TERMINAL_STATUSES.includes(resolvedVendor)) return resolvedVendor;
    return resolvedShiprocket ?? resolvedVendor;
  })();

  const isTerminal = TERMINAL_STATUSES.includes(effectiveStatus);

  const handleCopyToClipboard = (text: string, label: 'Order ID' | 'Tracking Number') => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    toast.success(`${label} copied to clipboard!`, {
      style: { background: '#1e293b', color: '#fff', borderRadius: '12px', fontSize: '14px' }
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isAfter = (milestone: string) => {
    return STATUS_ORDER.indexOf(effectiveStatus) > STATUS_ORDER.indexOf(milestone);
  };

  const getTrackingSteps = (): TrackingStep[] => {
    const isRtoFlow = ['undelivered', 'rto_initiated', 'rto_delivered'].includes(effectiveStatus);
    const isCancelledFlow = effectiveStatus === 'cancelled';

    if (isCancelledFlow) {
      return [
        {
          id: 'pending',
          label: 'Pending',
          description: 'Your order was placed',
          completed: true,
          current: false
        },
        {
          id: 'cancelled',
          label: 'Cancelled',
          description: 'Your order has been cancelled',
          completed: true,
          current: true
        }
      ];
    }

    if (isRtoFlow) {
      return [
        {
          id: 'pending',
          label: 'Pending',
          description: 'Order was placed successfully',
          completed: true,
          current: false
        },
        {
          id: 'picked_up',
          label: 'Picked Up',
          description: 'Courier picked up your order',
          completed: true,
          current: false
        },
        {
          id: 'out_for_delivery',
          label: 'Out for Delivery',
          description: 'Delivery attempt',
          completed: true,
          current: false
        },
        {
          id: 'undelivered',
          label: 'Undelivered',
          description: 'Delivery attempt failed',
          completed: true,
          current: effectiveStatus === 'undelivered'
        },
        {
          id: 'rto_initiated',
          label: 'RTO Initiated',
          description: 'Return to origin initiated',
          completed: effectiveStatus === 'rto_delivered' || effectiveStatus === 'rto_initiated',
          current: effectiveStatus === 'rto_initiated'
        },
        {
          id: 'rto_delivered',
          label: 'RTO Delivered',
          description: 'Order returned to sender',
          completed: effectiveStatus === 'rto_delivered',
          current: effectiveStatus === 'rto_delivered'
        }
      ];
    }

    // Default Forward Journey Flow
    return [
      {
        id: 'pending',
        label: 'Pending',
        description: 'Your order has been placed successfully',
        completed: true,
        current: effectiveStatus === 'pending'
      },
      {
        id: 'ready_to_ship',
        label: 'Ready to Ship',
        description: 'Order confirmed & getting ready',
        completed: effectiveStatus === 'ready_to_ship' || isAfter('ready_to_ship'),
        current: effectiveStatus === 'ready_to_ship'
      },
      {
        id: 'pickup_scheduled',
        label: 'Pickup Scheduled',
        description: 'Pickup scheduled with courier',
        completed: effectiveStatus === 'pickup_scheduled' || isAfter('pickup_scheduled'),
        current: effectiveStatus === 'pickup_scheduled'
      },
      {
        id: 'picked_up',
        label: 'Picked Up',
        description: 'Courier picked up your order, in transit',
        completed: effectiveStatus === 'picked_up' || isAfter('picked_up'),
        current: effectiveStatus === 'picked_up'
      },
      {
        id: 'out_for_delivery',
        label: 'Out for Delivery',
        description: 'Your order is out for delivery',
        completed: effectiveStatus === 'out_for_delivery' || isAfter('out_for_delivery'),
        current: effectiveStatus === 'out_for_delivery'
      },
      {
        id: 'delivered',
        label: 'Delivered',
        description: 'Your order has been delivered successfully',
        completed: effectiveStatus === 'delivered',
        current: effectiveStatus === 'delivered'
      }
    ];
  };

  const steps = getTrackingSteps();

  const getProgressPercentage = () => {
    if (isTerminal) return 100;
    const map: Record<string, number> = {
      pending: 10, ready_to_ship: 25, pickup_scheduled: 45,
      picked_up: 65, out_for_delivery: 85, delivered: 100
    };
    return map[effectiveStatus] || 10;
  };

  const getStepIcon = (stepId: string, completed: boolean, current: boolean) => {
    const cls = `w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
      completed || current ? 'text-white' : 'text-slate-400'
    }`;
    switch (stepId) {
      case 'pending': return <ShoppingCart className={cls} />;
      case 'ready_to_ship': return <PackageCheck className={cls} />;
      case 'pickup_scheduled': return <Clock className={cls} />;
      case 'picked_up': return <Package className={cls} />;
      case 'out_for_delivery': return <Truck className={cls} />;
      case 'delivered': return <MapPin className={cls} />;
      case 'undelivered': return <AlertCircle className={cls} />;
      case 'rto_initiated': return <RotateCcw className={cls} />;
      case 'rto_delivered': return <CheckCircle2 className={cls} />;
      case 'cancelled': return <X className={cls} />;
      default: return <Clock className={cls} />;
    }
  };

  const getOverallIcon = () => {
    switch (effectiveStatus) {
      case 'delivered': return <CheckCircle2 className="w-7 h-7 text-emerald-600" />;
      case 'out_for_delivery': return <Truck className="w-7 h-7 text-indigo-600" />;
      case 'picked_up': return <Package className="w-7 h-7 text-indigo-500" />;
      case 'pickup_scheduled': return <Clock className="w-7 h-7 text-amber-600" />;
      case 'ready_to_ship': return <PackageCheck className="w-7 h-7 text-amber-600" />;
      case 'cancelled': return <AlertCircle className="w-7 h-7 text-rose-600" />;
      case 'undelivered': return <AlertCircle className="w-7 h-7 text-red-500" />;
      case 'rto_initiated':
      case 'rto_delivered': return <RotateCcw className="w-7 h-7 text-orange-500" />;
      default: return <Clock className="w-7 h-7 text-slate-500" />;
    }
  };

  const getStatusColor = () => {
    switch (effectiveStatus) {
      case 'delivered': return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'out_for_delivery':
      case 'picked_up': return 'text-indigo-700 bg-indigo-50 border-indigo-100';
      case 'pickup_scheduled':
      case 'ready_to_ship': return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'cancelled': return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'undelivered':
      case 'rto_initiated':
      case 'rto_delivered': return 'text-orange-700 bg-orange-50 border-orange-100';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getHeaderBg = () => {
    switch (effectiveStatus) {
      case 'delivered': return 'bg-emerald-50';
      case 'out_for_delivery':
      case 'picked_up': return 'bg-indigo-50';
      case 'cancelled':
      case 'undelivered': return 'bg-rose-50';
      case 'rto_initiated':
      case 'rto_delivered': return 'bg-orange-50';
      default: return 'bg-amber-50';
    }
  };

  const displayStatus = deliveryStatus ? (Object.keys(shiprocketToUserStatus).find(k => normalize(k) === normalizedShiprocket) || deliveryStatus) : null;
  const label = displayStatus || userStatusLabel[effectiveStatus] || effectiveStatus.replace(/_/g, ' ');

  return (
    <div className="w-full text-slate-800">
      {/* Header */}
      <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl p-4 mb-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -ml-8 -mb-8 pointer-events-none" />

        <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-inner transition-transform duration-300 hover:scale-105 ${getHeaderBg()}`}>
              {getOverallIcon()}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Track Order</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs font-bold text-slate-500">Order ID: <span className="font-mono text-slate-700">{orderId}</span></p>
                <button onClick={() => handleCopyToClipboard(orderId, 'Order ID')} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-400 hover:text-slate-600">
                  {copiedId === orderId ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-center">
            <span className={`px-3 py-1 rounded-xl border font-bold text-xs uppercase tracking-wider ${getStatusColor()}`}>
              {label}
            </span>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 active:scale-90">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {(trackingNumber || courierPartner) && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
            {trackingNumber && (
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-center justify-between group hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all duration-300">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Tracking Number</p>
                  <p className="text-sm font-bold text-slate-800 font-mono">{trackingNumber}</p>
                </div>
                <button onClick={() => handleCopyToClipboard(trackingNumber, 'Tracking Number')} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 active:scale-95 transition-all">
                  {copiedId === trackingNumber ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            )}
            {courierPartner && (
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-3 flex items-center group hover:border-indigo-100 hover:bg-white hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500"><Truck size={16} /></div>
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Courier Partner</p>
                    <p className="text-sm font-bold text-slate-800">{courierPartner}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Terminal status banners */}
      {effectiveStatus === 'cancelled' && (
        <div className="bg-rose-50/70 border border-rose-100 rounded-xl p-3 mb-3 flex items-start gap-3 shadow-sm">
          <AlertCircle className="text-rose-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h5 className="font-extrabold text-rose-800 text-sm">Order Cancelled</h5>
            <p className="text-xs text-rose-600/90 mt-1 leading-relaxed">This order has been cancelled. Contact support if you have any questions.</p>
          </div>
        </div>
      )}
      {effectiveStatus === 'failed_delivery' && (
        <div className="bg-red-50/70 border border-red-100 rounded-xl p-3 mb-3 flex items-start gap-3 shadow-sm">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h5 className="font-extrabold text-red-800 text-sm">Delivery Attempt Failed</h5>
            <p className="text-xs text-red-600/90 mt-1 leading-relaxed">Courier attempted delivery but was unsuccessful. Another attempt will be made.</p>
          </div>
        </div>
      )}
      {(effectiveStatus === 'return_in_progress' || effectiveStatus === 'returned') && (
        <div className="bg-orange-50/70 border border-orange-100 rounded-xl p-3 mb-3 flex items-start gap-3 shadow-sm">
          <RotateCcw className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h5 className="font-extrabold text-orange-800 text-sm">
              {effectiveStatus === 'returned' ? 'Order Returned' : 'Return in Progress'}
            </h5>
            <p className="text-xs text-orange-600/90 mt-1 leading-relaxed">
              {effectiveStatus === 'returned' ? 'Your order has been returned to the seller.' : 'Your order is on its way back to the seller.'}
            </p>
          </div>
        </div>
      )}

      {/* Timeline — hide for terminal statuses */}
      {!isTerminal && (
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl p-4 mb-3">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-indigo-500" />
                Delivery Progress
              </span>
              <span className="text-xs font-black text-indigo-600">{getProgressPercentage()}%</span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${getProgressPercentage()}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
              />
            </div>
          </div>

          <h4 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">Order Timeline</h4>
          <div className="space-y-0 pl-1">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 group"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="relative flex items-center justify-center">
                    {step.current && (
                      <>
                        <span className="absolute -inset-2.5 rounded-full bg-indigo-500/15 animate-ping opacity-60" />
                        <span className="absolute -inset-1.5 rounded-full bg-indigo-500/10 animate-pulse" />
                      </>
                    )}
                    <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                      step.completed
                        ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] text-white'
                        : step.current
                        ? 'bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] text-white'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}>
                      {getStepIcon(step.id, step.completed, step.current)}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-8 my-1 relative">
                      <div className={`absolute inset-0 rounded-full ${
                        steps[index + 1].completed
                          ? 'bg-gradient-to-b from-emerald-500 to-emerald-400'
                          : steps[index + 1].current
                          ? 'bg-gradient-to-b from-emerald-500 via-indigo-400 to-indigo-500'
                          : 'bg-slate-200'
                      }`} />
                    </div>
                  )}
                </div>

                <div className={`flex-1 pb-4 ${index === steps.length - 1 ? 'pb-0' : ''}`}>
                  <div className={`p-3 rounded-xl border transition-all duration-300 ${
                    step.current
                      ? 'bg-indigo-50/60 border-indigo-100 shadow-sm shadow-indigo-500/5'
                      : step.completed
                      ? 'bg-white/80 border-slate-100 hover:border-slate-200/80 hover:bg-slate-50/50 hover:shadow-sm'
                      : 'bg-transparent border-transparent opacity-50'
                  }`}>
                    <div className="flex items-center gap-2">
                      <h5 className={`font-extrabold text-sm tracking-wide ${
                        step.completed ? 'text-slate-800' :
                        step.current ? 'text-indigo-700' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </h5>
                      {step.current && (
                        <span className="text-[9px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-black animate-pulse uppercase tracking-wider">
                          Current
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className={`text-xs mt-1.5 leading-relaxed font-semibold ${
                        step.completed ? 'text-slate-500' :
                        step.current ? 'text-indigo-600/80' : 'text-slate-400/85'
                      }`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Delivery Journey */}
      {deliveryUpdates.length > 0 && (
        <div className="bg-white border border-slate-100 shadow-xl shadow-slate-200/40 rounded-2xl p-4">
          <h4 className="text-xs font-black text-slate-400 mb-4 flex items-center gap-2 tracking-wider uppercase">
            <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-500"><MapPin size={14} /></div>
            Delivery Journey
          </h4>
          <div className="space-y-3">
            {deliveryUpdates.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3 p-3 bg-slate-50/60 border border-slate-100 rounded-xl hover:border-slate-200/80 hover:bg-white hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-400 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_8px_rgba(99,102,241,0.3)] mt-1.5" />
                  {index < deliveryUpdates.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2" />}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5">
                    <p className="text-sm font-extrabold text-slate-800 capitalize tracking-wide">
                      {update.status.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded-md self-start sm:self-auto">
                      {update.timestamp && !isNaN(new Date(update.timestamp).getTime())
                        ? new Date(update.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                        : update.date || ''}
                    </p>
                  </div>
                  {update.message && (
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-semibold bg-white p-2.5 rounded-xl border border-slate-100">{update.message}</p>
                  )}
                  {update.location && (
                    <div className="inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md border border-indigo-100/50">
                      <MapPin size={10} />
                      <span>{update.location}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
