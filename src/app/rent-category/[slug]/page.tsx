'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { categories } from '@/data/mockData';
import { ArrowRight, ChevronDown, ArrowUpDown, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
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
  
  // Dropdown UI States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTenureOpen, setIsTenureOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ label: 'All Types', value: '0' });
  const [selectedTenure, setSelectedTenure] = useState({ label: 'All Durations', value: '0' });
  const [sortOptions, setSortOptions] = useState([
    { label: 'All Types', value: '0' },
    { label: 'Rent', value: '1' },
    { label: 'Sell', value: '2' },
  ]);

  const [tenureOptions, setTenureOptions] = useState([
    { label: 'All Durations', value: '0' },
    { label: 'Daily', value: '1' },
    { label: 'Monthly', value: '2' },
  ]);

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);

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
      const formData = new FormData();
      formData.append("category_id", slug);
      try {
        const res = await api.post(endPointApi.webSubCategoryList, formData);
        setCategoryList(res.data.data || []);
        
        // Update options if available in API
        if (res.data.sort_options && Array.isArray(res.data.sort_options)) {
          setSortOptions([{ label: 'All Types', value: '0' }, ...res.data.sort_options]);
        }
        if (res.data.tenure_options && Array.isArray(res.data.tenure_options)) {
          setTenureOptions([{ label: 'All Durations', value: '0' }, ...res.data.tenure_options]);
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

  // Fetch products based on selected subcategory filter
  useEffect(() => {
    const fetchProducts = async () => {
      const formData = new FormData();
      formData.append("category_id", slug);

      // If "All" is selected, don't pass sub_category_id, otherwise pass the selected filter
      if (activeFilter !== 'all') {
        formData.append("sub_category_id", activeFilter);
      }

      // Add dynamic filters from screenshot
      if (selectedSort.value !== '0') {
        formData.append("filter_rent_sell", selectedSort.value);
      }
      
      if (selectedTenure.value !== '0') {
        formData.append("filter_tenure", selectedTenure.value);
      }

      try {
        const res = await api.post(endPointApi.webCategoryProductList, formData);
        setProductList(res.data.data || []);
      } catch (err) {
        console.error("Error fetching products", err);
        setProductList([]);
      }
    };

    if (slug) {
      fetchProducts();
    }
  }, [slug, activeFilter, selectedSort, selectedTenure]);
  const router = useRouter();

  const handleFilterClick = (filterSlug: string) => {
    if (filterSlug === 'all') {
      router.push(`/rent-category/${slug}`);
    } else {
      router.push(`/rent-category/${slug}?sub=${filterSlug}`);
    }
  };

  const currentCategoryName = filterCategories.find(c => c.slug === activeFilter)?.name || 'Products';

  // Use products from API instead of mock data
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

        {/* Controls Bar (Sort/Tenure) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 px-1">
          
          {/* Custom Sort Dropdown */}
          <div className="relative z-30 w-full sm:w-auto">
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
          <div className="relative z-20 w-full sm:w-auto">
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

        {/* Products Grid */}
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


        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="primary" size="lg" className="px-12 shadow-lg shadow-purple-500/20">
              Load More Products
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No products found in this category.</p>
          </div>
        )}

        {/* SEO Content Section */}
        <CategorySEOContent />
      </div>
    </div>
  );
}
