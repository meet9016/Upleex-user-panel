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
        // Parallel fetch for Category products AND Vendor-specific products
        const [categoryRes, vendorRes] = await Promise.all([
          productService.getCategoryProducts({
            category_id: categoryId,
            page: 1,
            limit: 100
          }),
          vendorId ? productService.getVendorProducts({
            vendor_id: vendorId,
            page: 1,
            limit: 50
          }) : Promise.resolve({ data: [] })
        ]);
        
        let allCategoryProducts = [];
        if (Array.isArray(categoryRes?.data)) {
          allCategoryProducts = categoryRes.data;
        } else if (Array.isArray(categoryRes?.data?.product_data)) {
          allCategoryProducts = categoryRes.data.product_data;
        }

        let allVendorProducts = [];
        if (Array.isArray(vendorRes?.data)) {
          allVendorProducts = vendorRes.data;
        } else if (Array.isArray(vendorRes?.data?.product_data)) {
          allVendorProducts = vendorRes.data.product_data;
        }

        // --- Priority Tiers ---

        // Tier 0: Same Vendor + Boosted (Top Priority, Any Category)
        let t0 = allVendorProducts.filter((p: any) => 
          p.is_boosted === true && 
          String(p.id || p._id || p.product_id) !== String(currentProductId)
        );

        // Tier 1: Other Vendors + Boosted (Same Category)
        let t1 = allCategoryProducts.filter((p: any) => 
          p.is_boosted === true && 
          String(p.vendor_id || p.vendor_india_id) !== String(vendorId) &&
          String(p.id || p.product_id) !== String(currentProductId)
        );

        // Tier 2: Other Vendors + Same Subcategory + Priority
        let t2 = allCategoryProducts.filter((p: any) => 
          String(p.sub_category_id) === String(subCategoryId) && 
          p.is_priority === true && 
          p.is_boosted !== true && 
          String(p.vendor_id || p.vendor_india_id) !== String(vendorId) &&
          String(p.id || p.product_id) !== String(currentProductId)
        );

        // Tier 3: Same Vendor + Same Category + Priority (Not Boosted)
        let t3 = allCategoryProducts.filter((p: any) => 
          p.is_priority === true && 
          p.is_boosted !== true && 
          String(p.vendor_id || p.vendor_india_id) === String(vendorId) &&
          String(p.id || p.product_id) !== String(currentProductId)
        );

        // Tier 4: Fallback - General Category Products
        let t4 = allCategoryProducts.filter((p: any) => 
          String(p.id || p.product_id) !== String(currentProductId) &&
          !p.is_priority &&
          !p.is_boosted &&
          !t0.find((x: any) => String(x.id || x._id) === String(p.id || p.product_id)) &&
          !t1.find((x: any) => String(x.id || x._id) === String(p.id || p.product_id)) &&
          !t2.find((x: any) => String(x.id || x._id) === String(p.id || p.product_id)) &&
          !t3.find((x: any) => String(x.id || x._id) === String(p.id || p.product_id))
        );

        // --- Shuffle Logic ---
        const shuffleArray = (array: any[]) => {
          const timestamp = Math.floor(Date.now() / (5 * 60 * 1000));
          const seededRandom = (seed: number) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
          };

          let m = array.length, t, i;
          let seed = timestamp;
          while (m) {
            i = Math.floor(seededRandom(seed++) * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
          }
          return array;
        };

        // Combine tiers and pick top 4
        const finalPool = [
          ...shuffleArray(t0),
          ...shuffleArray(t1),
          ...shuffleArray(t2),
          ...shuffleArray(t3),
          ...shuffleArray(t4)
        ];

        setProducts(finalPool.slice(0, 4));
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

