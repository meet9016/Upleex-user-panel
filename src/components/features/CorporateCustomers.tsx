'use client';

import { memo, useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

interface LogoItemProps {
  src: string;
  name?: string;
}

const LogoItem = memo(({ src, name }: LogoItemProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-20 sm:h-24 px-4 sm:px-6 mx-2 sm:mx-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group/item hover:-translate-y-1">
      <div className="relative w-full h-12">
        <Image
          src={imgSrc}
          alt={name || "Corporate Customer Logo"}
          fill
          sizes="180px"
          className="object-contain opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500"
          priority={false}
          onError={() => setImgSrc('/placeholder-logo.png')} // Fallback if image fails to load
        />
      </div>
    </div>
  );
});

LogoItem.displayName = 'LogoItem';

export const CorporateCustomers = () => {
  const [vendorLogos, setVendorLogos] = useState<any[]>([]);
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await api.get(endPointApi.approvedLogos);
        if (response.data.success && response.data.data) {
          setVendorLogos(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching vendor logos:', error);
      }
    };
    fetchLogos();
  }, []);

  const logosToShow = useMemo(() => {
    // Only use vendor logos from API as requested
    const apiLogos = vendorLogos
      .filter(v => v.logo)
      .map(v => {
        const trimmedLogo = v.logo.trim();
        return {
          src: trimmedLogo.startsWith('http') ? trimmedLogo : `https://upleex.2min.cloud/${trimmedLogo}`,
          name: v.name
        };
      });

    if (apiLogos.length === 0) return [];
    
    // Repeat logos to ensure continuous marquee effect
    const REPEAT_COUNT = apiLogos.length < 5 ? 8 : 4;
    return Array.from({ length: REPEAT_COUNT }).flatMap(() => apiLogos);
  }, [vendorLogos]);

  if (logosToShow.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 sm:mb-16 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-primary mb-4 sm:mb-6 inline-block tracking-tight">
          Our Corporate Customers
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Trusted by leading companies and startups across the country
        </p>
      </div>

      <div className="relative flex overflow-x-hidden group marquee-group">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee py-4 w-max">
          {logosToShow.map((logo, index) => (
            <LogoItem key={`${logo.src}-${index}`} src={logo.src} name={logo.name} />
          ))}
        </div>
      </div>
    </section>
  );
};
