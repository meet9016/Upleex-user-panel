import React from 'react';
import clsx from 'clsx';
import { Button } from '../ui/Button';

// Static Data based on user's screenshot
const RELATED_PRODUCTS = [
  {
    id: 1,
    title: "Spoke Wheelchair - Self Propelling Manual",
    price: 120.00,
    unit: "Day",
    image: "https://upleex.2min.cloud/upload/product_main_images/2026/01/2026-01-29/ce145a2a7c6ba13df4baceb3ac7843fd.jpg"
  },
  {
    id: 2,
    title: "Karma MAG Wheelchair",
    price: 120.00,
    unit: "Day",
    image: "https://upleex.2min.cloud/upload/product_main_images/2026/01/2026-01-29/ce145a2a7c6ba13df4baceb3ac7843fd.jpg"
  },
  {
    id: 3,
    title: "Recliner Wheelchair",
    price: 400.00,
    unit: "Day",
    image: "https://upleex.2min.cloud/upload/product_main_images/2026/01/2026-01-29/ce145a2a7c6ba13df4baceb3ac7843fd.jpg"
  },
  {
    id: 4,
    title: "Semi Fowler Bed",
    price: 194.00,
    unit: "Day",
    image: "https://upleex.2min.cloud/upload/product_main_images/2026/01/2026-01-29/ce145a2a7c6ba13df4baceb3ac7843fd.jpg"
  }
];

export const RelatedProducts = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 mt-10 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          You May Also Like
        </h2>
        {/* Optional: View All link if needed in future */}
        {/* <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</a> */}
      </div>
      
      {/* Products Grid */}
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RELATED_PRODUCTS.map((product) => (
            <div 
              key={product.id}
              className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300"
            >
              {/* Image Area */}
              <div className="aspect-[4/3] bg-gray-50 p-4 relative overflow-hidden">
                 <img 
                   src={product.image} 
                   alt={product.title}
                   className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
                 />
                 
                 {/* Quick action overlay (optional) */}
                 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Content Area */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors" title={product.title}>
                  {product.title}
                </h3>
                
                <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg font-extrabold text-blue-600 group-hover:text-blue-700 transition-colors">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-gray-400">
                      /{product.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
