import React, { useEffect, useState } from 'react';
import { productService } from '@/services/productService';
import { ProductCard } from './ProductCard';

interface RelatedProductsProps {
  categoryId?: string;
  subCategoryId?: string;
  vendorId?: string;
  currentProductId?: string;
}

export const RelatedProducts = ({
  categoryId,
  subCategoryId,
  vendorId,
  currentProductId
}: RelatedProductsProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const res = await productService.getRelatedProducts({
          category_id: categoryId,
          sub_category_id: subCategoryId,
          vendor_id: vendorId,
          current_product_id: currentProductId
        });
        
        if (res?.success && Array.isArray(res.data)) {
          setProducts(res.data);
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, subCategoryId, vendorId, currentProductId]);

  if (loading) {
    return (
      <div className="mt-10 flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Finding matching products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 mt-10 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
          You May Also Like
        </h2>
      </div>

      {/* Products Grid */}
      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id || product.product_id} 
              product={product} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

