'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { featuredProducts, categories } from '@/data/mockData';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export default function RentCategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  // Initialize filter based on URL slug or default to 'all'
  const [activeFilter, setActiveFilter] = useState(slug || 'all');

  // Update active filter when slug changes
  useEffect(() => {
    if (slug) setActiveFilter(slug);
  }, [slug]);

  const [categoryList, setCategoryList] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);

  // Dynamic filter categories: "All" + API data
  const filterCategories = [
    { name: 'All', slug: 'all' },
    ...(categoryList?.map((cat: any) => ({
      name: cat.name,
      slug: cat.id,
      image: cat.image
    })) || [])
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      const formData = new FormData();
      formData.append("category_id", slug);
      try {
        const res = await api.post(endPointApi.webSubCategoryList, formData);
        setCategoryList(res.data.data);
      } catch (err) {
        console.error("Error fetching categories", err);
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
  }, [slug, activeFilter]);
  const handleFilterClick = (filterSlug: string) => {
    setActiveFilter(filterSlug);
  };

  const currentCategoryName = filterCategories.find(c => c.slug === activeFilter)?.name || 'Products';

  // Use products from API instead of mock data
  const filteredProducts = productList;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <div className="text-sm text-slate-500 flex gap-2 mb-2">
              <span className="hover:text-upleex-purple cursor-pointer">Home</span> / <span>Rent</span> / <span className="text-upleex-purple font-medium">{currentCategoryName}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{currentCategoryName}</h1>
          </div>
        </div>
      </div>

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
                  className={`group flex items-center gap-2 whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${activeFilter === cat.slug
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
          {/* Left side mock sort */}
          <div className="relative group w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-upleex-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
            </div>
            <select className="w-full sm:w-64 appearance-none pl-12 pr-10 py-3 bg-white border-2 border-gray-100 rounded-full text-sm font-semibold text-slate-700 hover:border-upleex-purple/50 hover:shadow-md focus:outline-none focus:border-upleex-purple focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all">
              <option>Sort by: Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
            <ChevronDown className="absolute right-5 top-4 text-gray-400 pointer-events-none group-hover:text-upleex-purple transition-colors" size={16} />
          </div>

          {/* Right side mock tenure */}
          <div className="relative group w-full sm:w-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-upleex-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
            </div>
            <select className="w-full sm:w-64 appearance-none pl-12 pr-10 py-3 bg-white border-2 border-gray-100 rounded-full text-sm font-semibold text-slate-700 hover:border-upleex-purple/50 hover:shadow-md focus:outline-none focus:border-upleex-purple focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all">
              <option>Tenure: 3 Months</option>
              <option>Tenure: 6 Months</option>
              <option>Tenure: 12 Months</option>
            </select>
            <ChevronDown className="absolute right-5 top-4 text-gray-400 pointer-events-none group-hover:text-upleex-purple transition-colors" size={16} />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="primary" size="lg" className="px-12 shadow-lg shadow-purple-500/20">
              Load More Products
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
