import React from 'react';
import { Modal } from '../ui/Modal';
import { Check, Star, X } from 'lucide-react';
import Image from 'next/image';

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
      align="top"
      className="!bg-transparent !shadow-none !max-w-2xl overflow-visible"
    >
      <div className="relative bg-[#2563EB] rounded-3xl p-8 text-white mx-4 ring-8 ring-white/20">
        {/* Close Button Override */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-8">
          Get Upleex App To Enjoy
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          {/* QR Code Section */}
          <div className="bg-white p-3 rounded-xl shrink-0">
            <div className="w-32 h-32 relative">
              {/* QR code that points to Google Play Store */}
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dcom.shopno.upleex"
                alt="Download App QR Code"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Benefits Section */}
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              {[
                'Exclusive app only discounts',
                'Early access to new products',
                'Rent and Sell products easily'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-green-500 rounded-full p-0.5 shrink-0">
                    <Check size={14} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="font-medium text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            {/* <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <span className="text-xl font-bold">4.7</span>
                <Star size={20} className="text-yellow-400 fill-yellow-400" />
              </div>
              
              <div className="h-8 w-px bg-white/20"></div>

              <div>
                <div className="text-xl font-bold">50k+</div>
                <div className="text-xs text-blue-100">App Downloads</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Store Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <button className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors border border-gray-800 shadow-lg min-w-[160px]">
            <svg viewBox="0 0 384 512" fill="currentColor" className="w-8 h-8">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 46.9 126.7 98.9 126.7 25.8 0 49.7-18.7 92.4-18.7 43.1 0 72.1 18.7 102.4 18.7 37.3 0 75.5-74 103.8-126.3-4.6-9-19.8-45.7-90.3-46.4zM224.1 46.8c-18.1 21.5-16.4 58.2.2 75.5 15.3-20.5 32.2-39.2 26.4-75.5z" />
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-medium opacity-80">Download on the</span>
              <span className="text-lg font-bold">App Store</span>
            </div>
          </button>

          <button
            onClick={() => window.open('https://play.google.com/store/apps/details?id=com.shopno.upleex', '_blank')}
            className="flex items-center gap-3 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors border border-gray-800 shadow-lg min-w-[160px] cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <path
                fill="currentColor"
                d="M21.35 11.1H12v2.98h5.35c-.23 1.23-.93 2.27-1.98 2.98v2.48h3.2c1.87-1.72 2.93-4.25 2.93-7.22 0-.73-.07-1.44-.2-2.12zM12 22c2.7 0 4.96-.9 6.61-2.45l-3.2-2.48c-.89.6-2.03.95-3.41.95-2.62 0-4.83-1.77-5.62-4.15H3.08v2.6A10 10 0 0 0 12 22zM6.38 13.87A5.96 5.96 0 0 1 6.07 12c0-.65.11-1.28.31-1.87v-2.6H3.08A10 10 0 0 0 2 12c0 1.64.39 3.19 1.08 4.47l3.3-2.6zM12 6.5c1.47 0 2.78.51 3.82 1.5l2.86-2.86C16.95 3.36 14.69 2.5 12 2.5A10 10 0 0 0 3.08 7.53l3.3 2.6C7.17 8.27 9.38 6.5 12 6.5z"
              />
            </svg>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] font-medium opacity-80">GET IT ON</span>
              <span className="text-lg font-bold">Google Play</span>
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};
