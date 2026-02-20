'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Store, PackageOpen, ArrowUpDown, Calendar, ChevronDown, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/features/ProductCard';
import { BackButton } from '@/components/ui/BackButton';
import { Pagination } from '@/components/ui/Pagination';
import { productService } from '@/services/productService';

export default function SellerPage() {
  const searchParams = useSearchParams();
  const vendorId = searchParams?.get('vendor_id') ?? '';
  const vendorNameFromQuery = searchParams?.get('vendor_name') ?? null;

  const [vendorName, setVendorName] = useState<string | null>(vendorNameFromQuery);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTenureOpen, setIsTenureOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ label: 'All Types', value: '0' });
  const [selectedTenure, setSelectedTenure] = useState({ label: 'All Durations', value: '0' });
  const [sortOptions] = useState([
    { label: 'All Types', value: '0' },
    { label: 'Rent', value: '1' },
    { label: 'Sell', value: '2' },
  ]);
  const [tenureOptions] = useState([
    { label: 'All Durations', value: '0' },
    { label: 'Daily', value: '1' },
    { label: 'Monthly', value: '2' },
  ]);
  const ITEMS_PER_PAGE = 12;
  const isFirstFilterLoadRef = useRef(true);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      if (!vendorId) return;
      setLoading(true);

      try {
        const res = await productService.getVendorProducts({
          vendor_id: vendorId,
          filter_rent_sell: selectedSort.value,
          filter_tenure: selectedTenure.value,
          page: currentPage
        });
        const payload = res?.data;
        let inferredVendorName: string | null = null;

        if (Array.isArray(payload)) {
          setProducts(payload);

          if (payload.length > 0) {
            inferredVendorName = payload[0].vendor_name || null;
          }

          const hasFullPage = payload.length >= ITEMS_PER_PAGE;
          setProductCount(payload.length || null);
          setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
        } else {
          const data = payload || {};
          const productData = Array.isArray(data.product_data) ? data.product_data : [];
          setProducts(productData);

          if (productData.length > 0) {
            inferredVendorName = productData[0].vendor_name || null;
          }

          const hasFullPage = productData.length >= ITEMS_PER_PAGE;
          setProductCount(productData.length || null);
          setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
        }

        if (!vendorName && inferredVendorName) {
          setVendorName(inferredVendorName);
        }
      } catch (error) {
        console.error('Error fetching vendor products', error);
        setProducts([]);
        setProductCount(null);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, [vendorId, selectedSort, selectedTenure, currentPage]);

  useEffect(() => {
    if (isFirstFilterLoadRef.current) {
      isFirstFilterLoadRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [vendorId, selectedSort, selectedTenure]);

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
              {/* {productCount !== null && (
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold">
                    {productCount} Products
                  </span>
                </div>
              )} */}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Products from {vendorName || 'Vendor'}
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative z-30 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsSortOpen(!isSortOpen);
                    setIsTenureOpen(false);
                  }}
                  className={`w-full sm:w-64 flex items-center justify-between pl-4 pr-4 py-3 bg-white border-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isSortOpen
                      ? 'border-upleex-purple shadow-lg shadow-purple-500/10 ring-4 ring-purple-500/5'
                      : 'border-gray-100 text-slate-700 hover:border-upleex-purple/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-upleex-purple ${
                        isSortOpen ? 'scale-110' : ''
                      } transition-transform duration-300`}
                    >
                      <ArrowUpDown size={18} />
                    </span>
                    <span className="truncate">{selectedSort.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isSortOpen ? 'rotate-180 text-upleex-purple' : ''
                    }`}
                  />
                </button>

                <div
                  className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 origin-top ${
                    isSortOpen
                      ? 'opacity-100 scale-100 translate-y-0 visible'
                      : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                  }`}
                >
                  <div className="p-1.5">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          selectedSort.value === option.value
                            ? 'bg-purple-50 text-upleex-purple'
                            : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        }`}
                      >
                        {option.label}
                        {selectedSort.value === option.value && (
                          <Check size={16} className="text-upleex-purple" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div className="relative z-20 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsTenureOpen(!isTenureOpen);
                    setIsSortOpen(false);
                  }}
                  className={`w-full sm:w-64 flex items-center justify-between pl-4 pr-4 py-3 bg-white border-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isTenureOpen
                      ? 'border-upleex-purple shadow-lg shadow-purple-500/10 ring-4 ring-purple-500/5'
                      : 'border-gray-100 text-slate-700 hover:border-upleex-purple/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-upleex-purple ${
                        isTenureOpen ? 'scale-110' : ''
                      } transition-transform duration-300`}
                    >
                      <Calendar size={18} />
                    </span>
                    <span className="truncate">{selectedTenure.label}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform duration-300 ${
                      isTenureOpen ? 'rotate-180 text-upleex-purple' : ''
                    }`}
                  />
                </button>

                <div
                  className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 origin-top ${
                    isTenureOpen
                      ? 'opacity-100 scale-100 translate-y-0 visible'
                      : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
                  }`}
                >
                  <div className="p-1.5">
                    {tenureOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedTenure(option);
                          setIsTenureOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          selectedTenure.value === option.value
                            ? 'bg-purple-50 text-upleex-purple'
                            : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                        }`}
                      >
                        {option.label}
                        {selectedTenure.value === option.value && (
                          <Check size={16} className="text-upleex-purple" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div> */}
            </div>
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
              <>
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
    </div>
  );
}
