'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ServiceRoundCard } from '@/components/features/ServiceRoundCard';
import { ServiceCard } from '@/components/features/ServiceCard';
import { serviceService, Service, ServiceCategory } from '@/services/serviceService';
import { Search, ArrowUpDown, ChevronDown, Check, PackageOpen, LayoutGrid, List, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { useCity } from '@/hooks/useCity';

export default function ServicesListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-upleex-purple border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <ServicesListContent />
    </Suspense>
  );
}

function ServicesListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCatId = searchParams?.get('category');
  const initialSearch = searchParams?.get('search') || '';

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ label: 'Newest First', value: 'newest' });

  const selectedCity = useCity();

  // Sync state with URL params
  useEffect(() => {
    setActiveCategory(selectedCatId || 'all');
    setSearchQuery(initialSearch || '');
    setDebouncedSearch(initialSearch || '');
  }, [selectedCatId, initialSearch]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms pause

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price_low' },
    { label: 'Price: High to Low', value: 'price_high' },
  ];

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await serviceService.getServiceCategories(selectedCity);
      setCategories(data);
    };
    fetchCategories();
  }, [selectedCity]);

  useEffect(() => {
    const fetchServices = async () => {
      if (activeCategory === 'all') {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const sortParams: any = {};
        if (selectedSort.value === 'price_low') {
          sortParams.sortBy = 'price';
          sortParams.order = 'asc';
        } else if (selectedSort.value === 'price_high') {
          sortParams.sortBy = 'price';
          sortParams.order = 'desc';
        } else {
          sortParams.sortBy = 'createdAt';
          sortParams.order = 'desc';
        }

        const data = await serviceService.getServices({
          category_id: activeCategory === 'all' ? undefined : activeCategory,
          city: selectedCity,
          search: debouncedSearch.trim() || undefined,
          ...sortParams
        });

        setServices(data);
      } catch (error) {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [activeCategory, debouncedSearch, selectedSort, selectedCity]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (id === 'all') {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    router.push(`/services-list?${params.toString()}`, { scroll: false });
  };

  const currentCategoryName = categories.find(c => c.categories_id === activeCategory)?.categories_name;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Search & Breadcrumbs Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[80px] z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {activeCategory !== 'all' ? (
                <button 
                  onClick={() => handleCategoryClick('all')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-upleex-purple"
                >
                  <ArrowLeft size={24} />
                </button>
              ) : (
                <BackButton />
              )}
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {activeCategory === 'all' ? 'Explore Service Categories' : currentCategoryName}
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  {activeCategory === 'all' 
                    ? 'Select a category to find premium services' 
                    : `Showing all premium services in ${currentCategoryName}`}
                </p>
              </div>
            </div>
 {activeCategory !== 'all' && (
            <div className="flex items-center gap-3">
              <div className="relative group flex-1 min-w-[300px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-upleex-purple transition-colors" />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:border-upleex-purple focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Custom Sort */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className={`flex items-center gap-3 px-5 py-2.5 bg-white border-2 rounded-2xl text-sm font-bold transition-all duration-300 ${isSortOpen ? 'border-upleex-purple shadow-lg ring-4 ring-purple-500/5' : 'border-gray-100 text-slate-700 hover:border-upleex-purple/50'}`}
                >
                  <ArrowUpDown size={16} className="text-upleex-purple" />
                  <span className="hidden sm:inline">{selectedSort.label}</span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-upleex-purple' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-gray-100 shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-1.5">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              setSelectedSort(option);
                              setIsSortOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${selectedSort.value === option.value ? 'bg-purple-50 text-upleex-purple' : 'text-slate-600 hover:bg-gray-50'}`}
                          >
                            {option.label}
                            {selectedSort.value === option.value && <Check size={16} />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
             )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Main Grid Section */}
          <div className="w-full">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-48 animate-pulse border border-gray-100"></div>
                ))}
              </div>
            ) : activeCategory === 'all' ? (
              /* CATEGORY GRID (Circular Boxes) */
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8"
              >
                <AnimatePresence>
                  {categories.map((cat, index) => (
                    <motion.div
                      key={cat.categories_id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <ServiceRoundCard category={cat} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : services.length > 0 ? (
              /* SERVICES GRID (Rectangular Cards) */
              <div className="w-full">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    Available Services <span className="text-sm font-medium text-gray-400">({services.length})</span>
                  </h2>
                </div>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence>
                    {services.map((service, index) => (
                      <motion.div
                        key={service.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ServiceCard service={service} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageOpen size={48} className="text-gray-200" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500 max-w-sm text-center font-medium">
                  We couldn't find any services in this category for your area.
                </p>
                <Button
                  variant="outline"
                  className="mt-8 rounded-2xl px-8 border-gray-200"
                  onClick={() => handleCategoryClick('all')}
                >
                  Back to All Categories
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
