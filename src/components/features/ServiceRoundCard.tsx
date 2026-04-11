import React from 'react';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface ServiceRoundCardProps {
  category: any;
  className?: string;
}

export const ServiceRoundCard: React.FC<ServiceRoundCardProps> = ({ category, className }) => {
  const categoryId = category.categories_id;
  const categoryName = category.categories_name;
  const categoryImage = category.image;
  const serviceCount = category.service_count;

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/image/placeholder.png';
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || '';
    return `${baseUrl}${imagePath}`;
  };

  return (
    <Link
      href={`/services-list?category=${categoryId}`}
      className="group block h-full"
    >
      <div
        className={`relative h-full rounded-2xl p-[1px] bg-gradient-to-br 
        from-upleex-blue/40 to-purple-500/40 
        hover:from-upleex-blue hover:to-purple-600 
        transition-all duration-300 ${className}`}
      >
        <div
          className="relative h-full bg-white/90 backdrop-blur 
          rounded-2xl px-2 py-4 md:px-4 md:py-6 flex flex-col items-center 
          text-center shadow-sm group-hover:shadow-xl 
          transition-all duration-300"
        >
          {/* Service Count Badge */}
          <span
            className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 
            text-[10px] md:text-xs font-bold bg-upleex-blue text-white 
            px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md whitespace-nowrap"
          >
            {serviceCount || 0} Services
          </span>

          {/* Image Container (Circular) */}
          <div className="relative mb-2 md:mb-4">
            <div
              className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden 
              bg-gradient-to-br from-blue-100 to-blue-200 
              flex items-center justify-center 
              group-hover:scale-110 transition-transform duration-300 shadow-inner"
            >
              <img
                src={getImageUrl(categoryImage)}
                alt={categoryName}
                width={112}
                height={112}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Category Name */}
          <h3
            title={categoryName}
            className="font-bold text-gray-900 truncate 
            w-full max-w-[160px] group-hover:text-upleex-blue 
            transition-colors duration-300 leading-tight"
          >
            {categoryName}
          </h3>

          {/* Hover CTA */}
          <span
            className="mt-2 text-xs text-gray-400 opacity-0
            translate-y-2 group-hover:opacity-100
            group-hover:translate-y-0 transition-all duration-300"
          >
            View services →
          </span>
        </div>
      </div>
    </Link>
  );
};
