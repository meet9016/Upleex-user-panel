import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  slug: string;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon: Icon, slug, count }) => {
  return (
    <Link href={`/rent-category/${slug}`} className="group block">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-upleex-blue/30 transition-all duration-300 h-full">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-upleex-blue flex items-center justify-center mb-4 group-hover:bg-upleex-blue group-hover:text-white transition-colors duration-300">
          <Icon size={28} />
        </div>
        <h3 className="text-slate-800 font-semibold group-hover:text-upleex-blue transition-colors">{name}</h3>
        {count !== undefined && (
          <span className="text-gray-400 text-xs mt-1">{count} items</span>
        )}
      </div>
    </Link>
  );
};
