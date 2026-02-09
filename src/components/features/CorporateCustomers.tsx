"use client";
import React from 'react';

// Real corporate customer logos
const LOGOS = [
  <img src="/Asset-6.png" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-7.png" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-8.png" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-9.png" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-10.png" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-30.webp" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-31.webp" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />,
  <img src="/Asset-32.webp" alt="Corporate Customer" loading="lazy" className="max-h-12 w-auto opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />
];

const LogoItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-center min-w-[180px] h-24 px-6 mx-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/item hover:-translate-y-1">
    {children}
  </div>
);

export const CorporateCustomers = () => {
  return (
    <section className="py-10 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6 inline-block">
          Our Corporate Customers
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Trusted by leading companies and startups across the country
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group marquee-group">
        {/* Gradient Masks for smooth fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee py-4 w-max">
          {/* First Set */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l1-${index}`}>
              {logo}
            </LogoItem>
          ))}
          {/* Second Set (Duplicate for smooth loop) */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l2-${index}`}>
              {logo}
            </LogoItem>
          ))}
          {/* Third Set (Extra buffer for wide screens) */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l3-${index}`}>
              {logo}
            </LogoItem>
          ))}
          {/* Fourth Set (Extra buffer) */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l4-${index}`}>
              {logo}
            </LogoItem>
          ))}
        </div>
      </div>
    </section>
  );
};
