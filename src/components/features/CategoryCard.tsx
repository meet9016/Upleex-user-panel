import React from "react";
import Link from "next/link";

interface CategoryCardProps {
  categories_name: string;
  image: string;
  categories_id: string;
  product_count?: number;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  categories_name,
  image,
  categories_id,
  product_count,
  className
}) => {
  return (
    <Link href={`/rent-category/${categories_id}`} className="group block h-full">
      <div className={`relative h-full rounded-2xl p-[1px] bg-gradient-to-br from-upleex-blue/40 to-purple-500/40 hover:from-upleex-blue hover:to-purple-600 transition-all duration-300 ${className}`}>
        <div className="h-full bg-white/90 backdrop-blur rounded-2xl px-4 py-6 flex flex-col items-center text-center shadow-sm group-hover:shadow-xl transition-all duration-300">

          {/* Product Count Badge */}
          {product_count !== undefined && (
            <span className="absolute top-[-10px] text-sm font-medium bg-upleex-blue text-white px-2 py-0.5 rounded-full">
              {product_count} Items
            </span>
          )}

          {/* Icon */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden" >
              <img
                src={image}
                alt={categories_name}
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>

          {/* Category Name */}
          <h3
            title={categories_name}
            className="font-semibold text-gray-800 truncate w-full max-w-[140px] group-hover:text-upleex-blue transition-colors"
          >
            {categories_name}
          </h3>

          {/* Hover CTA */}
          <p className="mt-2 text-xs text-gray-400 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            View products →
          </p>
        </div>
      </div>
    </Link>
  );
};
