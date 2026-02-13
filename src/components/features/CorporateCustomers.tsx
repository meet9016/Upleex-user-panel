"use client";
import Image from 'next/image';

// Real corporate customer logos
const LOGOS = [
  "/Asset-6.png",
  "/Asset-7.png",
  "/Asset-8.png",
  "/Asset-9.png",
  "/Asset-10.png",
  "/Asset-30.webp",
  "/Asset-31.webp",
  "/Asset-32.webp"
];

const LogoItem = ({ src }: { src: string }) => (
  <div className="flex items-center justify-center min-w-[180px] h-24 px-6 mx-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/item hover:-translate-y-1">
    <div className="relative w-full h-12">
      <Image 
        src={src} 
        alt="Corporate Customer" 
        fill
        className="object-contain opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500"
        sizes="180px"
      />
    </div>
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
            <LogoItem key={`l1-${index}`} src={logo} />
          ))}
          {/* Second Set (Duplicate for smooth loop) */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l2-${index}`} src={logo} />
          ))}
          {/* Third Set (Extra buffer for wide screens) */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l3-${index}`} src={logo} />
          ))}
          {/* Fourth Set (Extra buffer) */}
          {LOGOS.map((logo, index) => (
            <LogoItem key={`l4-${index}`} src={logo} />
          ))}
        </div>
      </div>
    </section>
  );
};
