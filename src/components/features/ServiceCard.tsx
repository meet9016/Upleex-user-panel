'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

interface ServiceCardProps {
  service: any;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, className }) => {
  const router = useRouter();

  const serviceId = service.id || service._id;
  const serviceName = service.service_name;
  const serviceImage = service.image;
  const serviceCategory = service.category_name;
  const serviceLocation = service.location || 'Surat';
  const servicePrice = service.price;
  const billingType = service.billing_type || 'day';

  const billingLabels: Record<string, string> = {
    day: 'Per Day',
    month: 'Per Month',
    hourly: 'Hourly'
  };

  const billingLabel = billingLabels[billingType] || 'Per Day';

  const handleCardClick = () => {
    if (serviceId) {
      router.push(`/service/${serviceId}`);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/image/placeholder-service.png';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';
    return `${baseUrl}${imagePath}`;
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* 🔥 IMAGE */}
      {/* 🔥 IMAGE */}
      <div className="p-3">
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">

          <img
            src={getImageUrl(serviceImage)}
            alt={serviceName}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-upleex-purple shadow-sm border border-purple-100">
              {serviceCategory}
            </span>
          </div>

        </div>
      </div>

      {/* 🔥 CONTENT CENTERED */}
      <div className="p-5 text-center">

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 leading-snug">
          {serviceName}
        </h3>

        {/* Price (PURPLE THEME) */}
        <p className="text-upleex-purple font-semibold mt-2">
          Price : ₹{Number(servicePrice).toLocaleString()} / {billingLabel}
        </p>

        {/* Location */}
        <div className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin size={14} className="text-upleex-purple" />
          <span>{serviceLocation}</span>
        </div>

        {/* Button (PURPLE) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (serviceId) router.push(`/service/${serviceId}`);
          }}
          className="mt-4 w-full bg-upleex-purple hover:bg-upleex-purple/90 text-white font-semibold py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          Book Service
        </button>
      </div>
    </motion.div>
  );
};
