'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { categories } from '@/data/mockData';
import { ArrowRight, ChevronDown, ArrowUpDown, Calendar, Check, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Pagination } from '@/components/ui/Pagination';
import { productService } from '@/services/productService';
import { motion } from 'framer-motion';

import { CategorySEOContent } from '@/components/features/CategorySEOContent';

export default function RentCategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RentCategoryContent />
    </Suspense>
  );
}

function RentCategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const subId = searchParams?.get('sub');
  
  const slug = params?.slug as string;
  const [activeFilter, setActiveFilter] = useState(subId || 'all');

  useEffect(() => {
    if (subId) {
      setActiveFilter(subId);
    } else {
      setActiveFilter('all');
    }
  }, [subId]);
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTenureOpen, setIsTenureOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ label: 'Rent', value: '1' });
  const [selectedTenure, setSelectedTenure] = useState({ label: 'All Durations', value: '0' });
  const [sortOptions, setSortOptions] = useState([
    { label: 'All Types', value: '0' },
    { label: 'Rent', value: '1' },
    { label: 'Sell', value: '2' },
  ]);

  const [tenureOptions, setTenureOptions] = useState([
    { label: 'All Durations', value: '0' },
    { label: 'Hourly', value: '3' },
    { label: 'Daily', value: '1' },
    { label: 'Monthly', value: '2' },
  ]);

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const tenureDropdownRef = useRef<HTMLDivElement | null>(null);

  // Dynamic filter categories: "All" + API data
  const filterCategories = [
    { name: 'All', slug: 'all' },
    ...(categoryList?.map((cat: any) => ({
      name: cat.subcategory_name || cat.name,
      slug: String(cat.subcategory_id || cat.id),
      image: cat.image
    })) || [])
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productService.getSubCategories(slug);
        setCategoryList(res.data || res.data?.data || res || []);
        
        // Update options if available in API
        const root = res.data || res;
        if (root.sort_options && Array.isArray(root.sort_options)) {
          setSortOptions([{ label: 'All Types', value: '0' }, ...root.sort_options]);
        }
        if (root.tenure_options && Array.isArray(root.tenure_options)) {
          setTenureOptions([{ label: 'All Durations', value: '0' }, ...root.tenure_options]);
        }
      } catch (err) {
        console.error("Error fetching categories", err);
        setCategoryList([]);
      }
    };

    if (slug) {
      fetchCategories();
    }
  }, [slug]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getCategoryProducts({
          category_id: slug,
          sub_category_id: activeFilter,
          filter_rent_sell: selectedSort.value,
          filter_tenure: selectedTenure.value,
          page: currentPage
        });
        const payload = res?.data;
        const root = res || {};

        // Case 1: data itself is array of products, meta on root
        if (Array.isArray(payload)) {
          setProductList(payload);

          const totalFromRoot =
            root.product_count ??
            root.total_items ??
            root.total_count ??
            root.total ??
            null;

          const lastPageFromRoot =
            root.last_page ??
            root.total_pages ??
            root.pages ??
            null;

          if (totalFromRoot !== null && totalFromRoot !== undefined) {
            const totalNumber = Number(totalFromRoot);
            setProductCount(totalNumber);

            const perPageRaw = root.per_page ?? ITEMS_PER_PAGE;
            const perPage = Number(perPageRaw) || ITEMS_PER_PAGE;
            const pages = Math.max(1, Math.ceil(totalNumber / perPage));
            setTotalPages(pages);
          } else if (lastPageFromRoot !== null && lastPageFromRoot !== undefined) {
            const pages = Math.max(1, Number(lastPageFromRoot));
            setProductCount(null);
            setTotalPages(pages);
          } else {
            // Fallback: assume more pages while we keep receiving full pages
            const hasFullPage = payload.length >= ITEMS_PER_PAGE;
            setProductCount(null);
            setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
          }
        } else {
          // Case 2: data is object with product_data and pagination/meta
          const products = Array.isArray(payload?.product_data) ? payload.product_data : [];
          setProductList(products);

          const pagination = payload?.pagination || payload?.pager || null;

          const countRaw =
            payload?.product_count ??
            pagination?.total ??
            pagination?.total_items ??
            pagination?.total_count ??
            null;

          const lastPageRaw =
            payload?.total_pages ??
            payload?.last_page ??
            pagination?.total_pages ??
            pagination?.last_page ??
            null;

          if (countRaw !== null && countRaw !== undefined) {
            const countNumber = Number(countRaw);
            setProductCount(countNumber);

            if (lastPageRaw !== null && lastPageRaw !== undefined) {
              setTotalPages(Math.max(1, Number(lastPageRaw)));
            } else {
              const perPageRaw = pagination?.per_page ?? ITEMS_PER_PAGE;
              const perPage = Number(perPageRaw) || ITEMS_PER_PAGE;
              const pages = Math.max(1, Math.ceil(countNumber / perPage));
              setTotalPages(pages);
            }
          } else if (lastPageRaw !== null && lastPageRaw !== undefined) {
            setProductCount(null);
            setTotalPages(Math.max(1, Number(lastPageRaw)));
          } else {
            setProductCount(null);
            setTotalPages(1);
          }
        }
      } catch (err) {
        console.error("Error fetching products", err);
        setProductList([]);
        setProductCount(null);
        setTotalPages(1);
      }
    };

    if (slug) {
      fetchProducts();
    }
  }, [slug, activeFilter, selectedSort, selectedTenure, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, activeFilter, selectedSort, selectedTenure]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(target)) {
        setIsSortOpen(false);
      }
      if (tenureDropdownRef.current && !tenureDropdownRef.current.contains(target)) {
        setIsTenureOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const router = useRouter();

  const handleFilterClick = (filterSlug: string) => {
    if (filterSlug === 'all') {
      router.push(`/rent-category/${slug}`);
    } else {
      router.push(`/rent-category/${slug}?sub=${filterSlug}`);
    }
  };

  const currentCategoryName = filterCategories.find(c => c.slug === activeFilter)?.name || 'Products';
  const filteredProducts = productList;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Section */}
      {/* <div className="bg-white border-b border-gray-100 pt-4 pb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton className="mb-2 hover:bg-transparent text-slate-500" />
          <div className="text-sm text-slate-500 flex gap-2 mb-2">
            <span className="hover:text-upleex-purple cursor-pointer">Home</span> / <span>Rent</span> / <span className="text-upleex-purple font-medium">{currentCategoryName}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">{currentCategoryName}</h1>
        </div>
      </div> */}

      {/* Top Filter Bar - Sticky Icon Header */}
      <div className="bg-white border-b-2 border-purple-50 sticky top-[80px] z-40 shadow-sm/50 backdrop-blur-md bg-white/95 supports-[backdrop-filter]:bg-white/80 transition-all">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4">
            {filterCategories.map((cat) => {
              const matchedCat = categories.find(c => c.slug === cat.slug);
              const Icon = matchedCat ? matchedCat.icon : null;

              return (
                <button
                  key={cat.slug}
                  onClick={() => handleFilterClick(cat.slug)}
                  className={`group flex items-center gap-2 whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 cursor-pointer select-none ${activeFilter === cat.slug
                    ? 'bg-upleex-purple border-upleex-purple text-white shadow-lg shadow-purple-500/20 ring-2 ring-purple-100 ring-offset-2'
                    : 'bg-white border-gray-100 text-slate-600 hover:border-upleex-purple/50 hover:bg-purple-50/50 hover:text-upleex-purple hover:shadow-md'
                    }`}
                >
                  {Icon && <Icon size={18} className={activeFilter === cat.slug ? 'text-white' : 'text-slate-400 group-hover:text-upleex-purple transition-colors'} />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-2">
            
            <BackButton/>
        </div>
        {/* Controls Bar (Sort/Tenure) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-1">
          
          {/* Custom Sort Dropdown */}
          <div className="relative z-30 w-full sm:w-auto" ref={sortDropdownRef}>
            <button 
              onClick={() => { setIsSortOpen(!isSortOpen); setIsTenureOpen(false); }}
              className={`w-full sm:w-64 flex items-center justify-between pl-4 pr-4 py-3 bg-white border-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isSortOpen 
                  ? 'border-upleex-purple shadow-lg shadow-purple-500/10 ring-4 ring-purple-500/5' 
                  : 'border-gray-100 text-slate-700 hover:border-upleex-purple/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-upleex-purple ${isSortOpen ? 'scale-110' : ''} transition-transform duration-300`}>
                  <ArrowUpDown size={18} />
                </span>
                <span className="truncate">{selectedSort.label}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-upleex-purple' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 origin-top ${
              isSortOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
            }`}>
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
                    {selectedSort.value === option.value && <Check size={16} className="text-upleex-purple" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Tenure Dropdown */}
          <div className="relative z-20 w-full sm:w-auto" ref={tenureDropdownRef}>
            <button 
              onClick={() => { setIsTenureOpen(!isTenureOpen); setIsSortOpen(false); }}
              className={`w-full sm:w-64 flex items-center justify-between pl-4 pr-4 py-3 bg-white border-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                isTenureOpen 
                  ? 'border-upleex-purple shadow-lg shadow-purple-500/10 ring-4 ring-purple-500/5' 
                  : 'border-gray-100 text-slate-700 hover:border-upleex-purple/50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-upleex-purple ${isTenureOpen ? 'scale-110' : ''} transition-transform duration-300`}>
                  <Calendar size={18} />
                </span>
                <span className="truncate">{selectedTenure.label}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isTenureOpen ? 'rotate-180 text-upleex-purple' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 origin-top ${
              isTenureOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
            }`}>
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
                    {selectedTenure.value === option.value && <Check size={16} className="text-upleex-purple" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <PackageOpen className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              We couldn't find any products in this category at the moment. Try adjusting your filters or check back later.
            </p>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.product_id || product.id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* SEO Content Section */}
        <CategorySEOContent />
      </div>
    </div>
  );
}
