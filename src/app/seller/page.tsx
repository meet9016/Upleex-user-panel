'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Store, PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/features/ProductCard';
import { BackButton } from '@/components/ui/BackButton';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export default function SellerPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams?.get('vendor_id') ?? '';
  const vendorNameFromQuery = searchParams?.get('vendor_name') ?? null;

  const [vendorName, setVendorName] = useState<string | null>(vendorNameFromQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      if (!vendorId) return;
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append('vendor_id', vendorId);

        const res = await api.post(endPointApi.webVendorProductList, formData);
        const data = res.data?.data || {};
        const productData = data.product_data || [];
        setProducts(productData);

        const countRaw = data.product_count;
        if (countRaw !== undefined && countRaw !== null) {
          setProductCount(Number(countRaw));
        } else {
          setProductCount(productData.length);
        }

        if (!vendorName && productData.length > 0) {
          setVendorName(productData[0].vendor_name || null);
        }
      } catch (error) {
        console.error('Error fetching vendor products', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, [vendorId, vendorName]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 px-6 sm:px-8 py-5 sm:py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mt-4">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 flex items-center justify-center">
              <Store size={32} className="text-upleex-blue" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-[0.18em] mb-1">
                Sold By
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {vendorName || 'Vendor'}
              </h1>
              {productCount !== null && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                    {productCount} Products
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Products from {vendorName || 'Vendor'}
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageOpen className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-4">
                  We couldn't find any products for this vendor.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.product_id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
