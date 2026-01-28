import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  categories_name: string;
  image: string;
  categories_id: string;
  product_count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ categories_name, image, categories_id, product_count }) => {
  
  return (
    <Link href={`/rent-category/${categories_id}`} className="group block">
      <div className="flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-upleex-blue/30 transition-all duration-300 h-full">
        <div className="w-24 h-24 rounded-full bg-blue-50 text-upleex-blue flex items-center justify-center mb-4 group-hover:bg-upleex-blue group-hover:text-white transition-colors duration-300">
          {/* <Icon size={28} /> */}
          <img src={image} sizes='28' />
        </div>
        {product_count !== undefined && (
          <span className="text-gray-400 text-xs mt-1">{product_count} items</span>
        )}
      </div>
      <h3 title={categories_name} className="text-center font-semibold truncate mb-4 h-6">
        {categories_name}
      </h3>
    </Link>
  );
};