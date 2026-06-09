import React from "react";
import Link from "next/link";
import { createSlug } from "@/utils/helper";

interface CategoryCardProps {
  categories_name: string;
  image: string;
  categories_id: string;
  slug?: string;
  citySlug?: string;
  product_count?: string | number;
  className?: string;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  categories_name,
  image,
  categories_id,
  slug,
  product_count,
  citySlug = "surat",
  className = "",
}) => {
  const urlSlug = slug || createSlug(categories_name);
  return (
    <Link
      href={`/rent/${citySlug}/${urlSlug}`}
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
          {/* Product Count Badge */}
          {product_count !== undefined && (
            <span
              className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 
              text-[10px] md:text-xs font-bold bg-upleex-blue text-white 
              px-2 py-0.5 md:px-3 md:py-1 rounded-full shadow-md whitespace-nowrap"
            >
              {product_count || 0} Items
            </span>
          )}

          {/* Image Container */}
          <div className="relative mb-2 md:mb-4">
            <div
              className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden 
              bg-gradient-to-br from-blue-100 to-blue-200 
              flex items-center justify-center 
              group-hover:scale-110 transition-transform duration-300 shadow-inner"
            >
              {image ? (
                <img
                  src={image}
                  alt={categories_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Category Name */}
          <h3
            title={categories_name}
            className="font-semibold text-gray-800 truncate 
            w-full max-w-[140px] group-hover:text-upleex-blue 
            transition-colors duration-300"
          >
            {categories_name}
          </h3>

          {/* Hover CTA */}
           <span
            className="mt-2 text-xs text-gray-400 opacity-0
            translate-y-2 group-hover:opacity-100
            group-hover:translate-y-0 transition-all duration-300"
          >
            View products →
          </span>
        </div>
      </div>
    </Link>
  );
};
