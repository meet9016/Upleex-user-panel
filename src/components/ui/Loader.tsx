'use client';

import React from 'react';
import Image from 'next/image';

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        <div className="relative w-20 h-20 mb-4">
          <div className="absolute inset-0 border-4 border-upleex-blue/20 rounded-full animate-pulse-custom" />
          
          <div className="absolute inset-0 border-t-4 border-upleex-blue rounded-full animate-spin" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 rounded-xl shadow-lg shadow-blue-500/10 flex items-center justify-center bg-white border border-gray-50 transform scale-100 animate-bounce-subtle">
              <Image
                src="/favicon.png"
                alt="Upleex"
                width={28}
                height={28}
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Upleex<span className="text-upleex-blue">.</span>
          </h3>
          <div className="flex gap-1.5 mt-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-upleex-blue rounded-full animate-loading-dot"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-custom {
          0%, 100% { transform: scale(0.8); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes loading-dot {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        .animate-pulse-custom {
          animation: pulse-custom 1.8s ease-in-out infinite;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        .animate-loading-dot {
          animation: loading-dot 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loader;
