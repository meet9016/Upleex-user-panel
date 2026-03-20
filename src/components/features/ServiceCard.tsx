'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Clock } from 'lucide-react';
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
      className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer ${className}`}
    // whileHover={{ y: -5 }}
    >
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={getImageUrl(serviceImage)}
          alt={serviceName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Category Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-upleex-purple shadow-sm">
            {serviceCategory}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 z-10 bg-gradient-to-r from-upleex-blue to-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
          <span>₹{Number(servicePrice).toLocaleString()}</span>
          <span className="text-[10px] opacity-90 font-medium">/ {billingLabel}</span>
        </div>


      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-upleex-purple transition-colors">
            {serviceName}
          </h3>
        </div>

        <div className="space-y-1.5 min-h-[40px]">
          <div className="flex items-center text-xs text-slate-500 font-medium">
            <MapPin size={14} className="mr-1.5 text-upleex-purple" />
            <span className="truncate">{serviceLocation}</span>
          </div>
        </div>

        <Button
          fullWidth
          variant="primary"
          className="mt-2 rounded-xl font-bold py-2.5 text-sm btn-primary transition-all cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (serviceId) router.push(`/service/${serviceId}`);
          }}
        >
          Book Service
        </Button>
      </div>
    </motion.div>
  );
};
