import React from 'react';
import { Modal } from '../ui/Modal';
import { Check, X } from 'lucide-react';

interface DownloadAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppPopup: React.FC<DownloadAppPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideHeader
      hideCloseButton
      noPadding
      align="center"
      className="!bg-transparent !shadow-none !max-w-2xl overflow-visible"
    >
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 rounded-3xl p-8 md:p-10 text-white mx-4 border border-white/20 shadow-2xl overflow-hidden">

        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"></div>

        {/* Close Button Override */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-md cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 flex flex-col items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-3 tracking-tight">
            Get the Upleex App
          </h2>
          <p className="text-blue-100 text-center max-w-md text-sm md:text-base">
            Scan the QR code or download directly from your favorite app store to enjoy a seamless experience.
          </p>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center justify-center">
          {/* QR Code Section */}
          <div className="bg-white p-4 rounded-3xl shrink-0 shadow-2xl ring-1 ring-black/5 transform transition-transform hover:scale-105 duration-300">
            <div className="w-36 h-36 relative">
              {/* QR code that points to Google Play Store */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.shopno.upleex"
                alt="Download App QR Code"
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="flex-1 space-y-4 w-full max-w-sm">
            <div className="space-y-3">
              {[
                'Exclusive app-only discounts',
                'Early access to new products',
                'Rent and sell products easily'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/10 hover:bg-white/15 transition-colors px-4 py-3 rounded-2xl backdrop-blur-sm border border-white/5">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-500 rounded-full p-1 shrink-0 shadow-sm">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="font-medium text-sm md:text-base text-blue-50">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Store Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 mt-12 justify-center">
          <button className="flex items-center justify-center gap-3 bg-black/90 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 border border-white/10 shadow-xl min-w-[200px] cursor-pointer group">
            <svg viewBox="0 0 384 512" fill="currentColor" className="w-7 h-7 group-hover:text-gray-200 transition-colors">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 126.7 98.9 126.7 25.8 0 49.7-18.7 92.4-18.7 43.1 0 72.1 18.7 102.4 18.7 37.3 0 75.5-74 103.8-126.3-4.6-9-19.8-45.7-90.3-46.4zM224.1 46.8c-18.1 21.5-16.4 58.2.2 75.5 15.3-20.5 32.2-39.2 26.4-75.5z" />
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[11px] font-medium text-gray-300 group-hover:text-gray-200 transition-colors">Download on the</span>
              <span className="text-xl font-bold">App Store</span>
            </div>
          </button>

          <button
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.shopno.upleex', '_blank')}
            className="flex items-center justify-center gap-3 bg-black/90 backdrop-blur-md text-white px-6 py-3.5 rounded-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 border border-white/10 shadow-xl min-w-[200px] cursor-pointer group"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 group-hover:text-gray-200 transition-colors">
              <path
                fill="currentColor"
                d="M21.35 11.1H12v2.98h5.35c-.23 1.23-.93 2.27-1.98 2.98v2.48h3.2c1.87-1.72 2.93-4.25 2.93-7.22 0-.73-.07-1.44-.2-2.12zM12 22c2.7 0 4.96-.9 6.61-2.45l-3.2-2.48c-.89.6-2.03.95-3.41.95-2.62 0-4.83-1.77-5.62-4.15H3.08v2.6A10 10 0 0 0 12 22zM6.38 13.87A5.96 5.96 0 0 1 6.07 12c0-.65.11-1.28.31-1.87v-2.6H3.08A10 10 0 0 0 2 12c0 1.64.39 3.19 1.08 4.47l3.3-2.6zM12 6.5c1.47 0 2.78.51 3.82 1.5l2.86-2.86C16.95 3.36 14.69 2.5 12 2.5A10 10 0 0 0 3.08 7.53l3.3 2.6C7.17 8.27 9.38 6.5 12 6.5z"
              />
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[11px] font-medium text-gray-300 group-hover:text-gray-200 transition-colors">GET IT ON</span>
              <span className="text-xl font-bold">Google Play</span>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};
