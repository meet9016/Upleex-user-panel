import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProductCard } from '../components/features/ProductCard';
import { featuredProducts, categories } from '../data/mockData';
import { ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const RentCategory: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  
  // Initialize filter based on URL slug or default to 'all'
  const [activeFilter, setActiveFilter] = useState(slug || 'all');

  // Update active filter when slug changes
  useEffect(() => {
    if (slug) setActiveFilter(slug);
  }, [slug]);

  // Extended mocked categories for the filter bar to mimic the reference image vibe
  const filterCategories = [
    { name: 'All', slug: 'all' },
    ...categories,
    { name: 'Air Purifier', slug: 'air-purifier' }, // Extra mocks to show scrolling
    { name: 'Geyser', slug: 'geyser' },
    { name: 'Heaters', slug: 'heaters' },
    { name: 'Generators', slug: 'generators' },
  ];

  const handleFilterClick = (filterSlug: string) => {
    setActiveFilter(filterSlug);
    // Optional: Update URL without full reload if you want deep linking
    // navigate(`/rent-category/${filterSlug}`); 
  };
  
  const currentCategoryName = filterCategories.find(c => c.slug === activeFilter)?.name || 'Products';

  // Filter Logic:
  // 1. If 'all', show everything.
  // 2. If valid category, show products matching that category id/slug/name.
  // Note: structured real data would map precise IDs. Here we fuzzy match for demo.
  const filteredProducts = activeFilter === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(p => {
        // Mock matching logic: 
        // Real app would check p.categoryId === activeCategory.id
        // Here we just check if the product category text includes or matches.
        const filterName = filterCategories.find(c => c.slug === activeFilter)?.name;
        return p.category === filterName || (filterName === 'Heaters' && p.title.includes('Heater')) || (filterName === 'Hospital Beds' && p.category === 'Hospital Beds');
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Header Section - Moved to Top */}
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
               // Find icon from imported categories or fallback
               const matchedCat = categories.find(c => c.slug === cat.slug);
               const Icon = matchedCat ? matchedCat.icon : null;
               
               return (
                 <button
                   key={cat.slug}
                   onClick={() => handleFilterClick(cat.slug)}
                   className={`group flex items-center gap-2 whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border-2 ${
                     activeFilter === cat.slug 
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
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
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
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              </div>
              <select className="w-full sm:w-64 appearance-none pl-12 pr-10 py-3 bg-white border-2 border-gray-100 rounded-full text-sm font-semibold text-slate-700 hover:border-upleex-purple/50 hover:shadow-md focus:outline-none focus:border-upleex-purple focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all">
                 <option>Tenure: 3 Months</option>
                 <option>Tenure: 6 Months</option>
                 <option>Tenure: 12 Months</option>
              </select>
              <ChevronDown className="absolute right-5 top-4 text-gray-400 pointer-events-none group-hover:text-upleex-purple transition-colors" size={16} />
           </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {filteredProducts.map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="group">
                   <ProductCard product={product} /> 
                </div>
             ))}
             {filteredProducts.length < 4 && filteredProducts.map((product, idx) => (
                <div key={`dup-${product.id}-${idx}`}>
                   <ProductCard product={{...product, id: `dup-${product.id}-${idx}`}} />
                </div>
             ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
             <div className="text-slate-400 text-lg">No products found for {currentCategoryName}</div>
             <Button variant="outline" className="mt-4" onClick={() => setActiveFilter('all')}>View All Products</Button>
          </div>
        )}
        
        {filteredProducts.length > 0 && (
          <div className="mt-12 text-center">
             <Button variant="primary" className="min-w-[200px] h-12 rounded-lg font-semibold text-base shadow-lg shadow-purple-500/20">
                Load More
             </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};
