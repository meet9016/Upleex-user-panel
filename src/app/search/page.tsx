'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { BackButton } from '@/components/ui/BackButton';
import { Pagination } from '@/components/ui/Pagination';
import { PackageOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { searchService } from '@/services/searchService';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') ?? '';
  const city = searchParams?.get('city') ?? '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, city]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!search && !city) {
        setProducts([]);
        setTotalPages(1);
        return;
      }
      setLoading(true);
      try {
        const result = await searchService.searchProducts({
          city: city || undefined,
          search,
          page: currentPage
        });
        setProducts(result);
        const hasFullPage = result.length >= ITEMS_PER_PAGE;
        setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
      } catch (error) {
        console.error('Error fetching search products', error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, city, currentPage]);

  const titleText = search ? `Results for "${search}"` : 'Search Results';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton />

        {/* <div className="mt-6 flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{titleText}</h1>
          {city && (
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              City: {city}
            </span>
          )}
        </div> */}

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                <PackageOpen className="text-blue-500" size={32} />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                No products found
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                Try adjusting your search or changing the selected city to find more products.
              </p>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {products.map((product: any) => (
                  <ProductCard key={product.product_id || product.id} product={product} />
                ))}
              </motion.div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showWhenSingle
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
