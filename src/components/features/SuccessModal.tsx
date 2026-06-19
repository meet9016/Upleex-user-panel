import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Package, Store, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  orderDetails: {
    orderId: string;
    amount: number;
    items: any[];
    vendor_name?: string;
    vendor_address?: string;
    vendor_city?: string;
    vendor_mobile?: string;
    shiprocket_shipment_id?: string;
  } | null;
  onClose?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, orderDetails, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-4 shadow-sm">
            <Check size={32} strokeWidth={3} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Payment Successful!</h2>
          <p className="text-slate-500 mt-2 text-sm mb-6">
            Your order has been confirmed successfully. Thank you for shopping with us!
          </p>

          {orderDetails && (
            <div className="w-full bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 text-left">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Order ID</p>
                  <p className="font-semibold text-slate-800">#{orderDetails.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-medium">Amount Paid</p>
                  <p className="font-bold text-blue-600">₹{orderDetails.amount?.toLocaleString('en-IN')}</p>
                </div>
              </div>

              {orderDetails.shiprocket_shipment_id && (
                <div className="mb-3 text-[11px] bg-blue-50 text-blue-800 p-2.5 rounded-xl border border-blue-100 flex justify-between items-center">
                  <span className="font-semibold">Shipment ID (Shiprocket):</span>
                  <span className="font-mono font-bold select-all bg-white px-2 py-0.5 rounded border border-blue-200">{orderDetails.shiprocket_shipment_id}</span>
                </div>
              )}
              
              <div className="space-y-3 mt-4 max-h-[160px] overflow-y-auto pr-2">
                {orderDetails.items?.map((item, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image.startsWith('http') ? item.image : `https://upleex.2min.cloud/${item.image}`} 
                          alt={item.name} 
                          className="w-full h-full object-contain" 
                        />
                      ) : (
                        <Package size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500 line-clamp-1">Qty: {item.qty} × ₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Vendor Details */}
              {orderDetails.vendor_name && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <Store size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-semibold text-gray-500 tracking-[0.15em] mb-0.5 uppercase">
                        Sold By
                      </div>
                      <div className="text-sm font-bold text-slate-800 truncate">
                        {orderDetails.vendor_name}
                      </div>
                      {orderDetails.vendor_mobile && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone size={12} />
                          {orderDetails.vendor_mobile}
                        </div>
                      )}
                      {orderDetails.vendor_address && (
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} />
                          {orderDetails.vendor_address}, {orderDetails.vendor_city}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="flex flex-col gap-3 w-full">
            <Link href="/orders" className="w-full">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold flex justify-center items-center gap-2 transition-all hover:opacity-90 shadow-md"
              >
                Go to Orders Page
              </button>
            </Link>
            <Link href="/" className="w-full">
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-800 transition-colors"
              >
                Go to Home
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
