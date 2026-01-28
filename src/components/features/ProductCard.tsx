import React from 'react';
import Link from 'next/link';
import { MapPin, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product | any; // Support both old and new data structures
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  console.log("product", product);
  
  // Support both API data and mock data structures
  const productId = product.product_id || product.id;
  const productName = product.product_name || product.title;
  const productImage = product.product_main_image;
  const productPrice = product.price || product.pricePerMonth;
  const cancelPrice = product.cancel_price || (product.pricePerMonth ? Math.round(product.pricePerMonth * 1.2) : null);
  const productCategory = product.sub_category_name || product.category;
  const productLocation = product.location || 'Surat'; // Default location if not available
  
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={productImage || 'https://images.ctfassets.net/hrltx12pl8hq/28ECAQiPJZ78hxatLTa7Ts/2f695d869736ae3b0de3e56ceaca3958/free-nature-images.jpg?fit=fill&w=1200&h=630'} 
          alt={productName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors">
            <Heart size={18} />
          </button>
        </div>
        {productCategory && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800">
            {productCategory}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/browse-ads/${productId}`} className="hover:text-upleex-blue transition-colors">
            <h3 className="font-semibold text-slate-800 line-clamp-1 text-lg">{productName}</h3>
          </Link>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-3">
          <MapPin size={14} className="mr-1" />
          <span className="truncate">{productLocation}</span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-3">
          <div className="flex justify-center flex-col items-center">
             {cancelPrice && (
               <span className="text-gray-400 text-xs line-through mb-1">₹{cancelPrice}/Month</span>
             )}
             <span className="text-lg font-bold text-slate-800">₹{Number(productPrice || 0).toLocaleString()}<span className="text-xs text-gray-400 font-normal">/Month</span></span>
          </div>
          <Link href={`/browse-ads/${productId}`} className="w-full">
            <Button fullWidth variant="primary" className="rounded-lg shadow-sm font-semibold">Take On Rent</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
