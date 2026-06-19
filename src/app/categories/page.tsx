
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { categoryService, Category, SubCategory } from '@/services/categoryService';
import { serviceService } from '@/services/serviceService';
import { Checkbox } from '@/components/ui/Checkbox';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';
import { useCity } from '@/hooks/useCity';
import { useSearchParams } from 'next/navigation';
import { createSlug } from '@/utils/helper';

function CategoriesPageContent() {
  const searchParams = useSearchParams();
  const isService = searchParams?.get('type') === 'service';

  const [categories, setCategories] = useState<Category[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<string, SubCategory[]>>({});
  const [servicesLoadingMap, setServicesLoadingMap] = useState<Record<string, boolean>>({});
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedCity = useCity();

  // Reset selected category when switching service/product modes
  useEffect(() => {
    setSelectedCategoryIds([]);
    setServicesMap({});
    setServicesLoadingMap({});
  }, [isService]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        if (isService) {
          const data = await serviceService.getServiceCategories(selectedCity);
          const mapped: Category[] = data.map(sc => ({
            categories_id: sc.categories_id,
            categories_name: sc.categories_name,
            image: sc.image,
            product_count: sc.service_count,
            subcategories: []
          }));
          setCategories(mapped);
          if (mapped.length > 0 && selectedCategoryIds.length === 0) {
            setSelectedCategoryIds([mapped[0].categories_id]);
          }
        } else {
          const data = await categoryService.getCategories(selectedCity);
          const sortedData = [...data].sort((a, b) => Number(b.product_count || 0) - Number(a.product_count || 0));
          setCategories(sortedData);
          // Select the first category by default if none selected
          if (sortedData.length > 0 && selectedCategoryIds.length === 0) {
            setSelectedCategoryIds([sortedData[0].categories_id]);
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [selectedCity, isService]);

  // Fetch services for selected categories on demand if in service mode
  useEffect(() => {
    if (!isService || selectedCategoryIds.length === 0) return;

    const fetchServicesForCategories = async () => {
      const newIdsToFetch = selectedCategoryIds.filter(id => !servicesMap[id] && !servicesLoadingMap[id]);
      if (newIdsToFetch.length === 0) return;

      setServicesLoadingMap(prev => {
        const next = { ...prev };
        newIdsToFetch.forEach(id => {
          next[id] = true;
        });
        return next;
      });

      await Promise.all(
        newIdsToFetch.map(async (catId) => {
          try {
            const res = await serviceService.getServices({
              category_id: catId,
              city: selectedCity,
              limit: 100
            });
            const subCats: SubCategory[] = res.data.map(s => ({
              subcategory_id: s.id,
              subcategory_name: s.service_name,
              image: s.image
            }));
            setServicesMap(prev => ({
              ...prev,
              [catId]: subCats
            }));
          } catch (err) {
            console.error(`Error fetching services for category ${catId}:`, err);
            setServicesMap(prev => ({
              ...prev,
              [catId]: []
            }));
          } finally {
            setServicesLoadingMap(prev => ({
              ...prev,
              [catId]: false
            }));
          }
        })
      );
    };

    fetchServicesForCategories();
  }, [selectedCategoryIds, isService, selectedCity, servicesMap, servicesLoadingMap]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getSubcategories = (cat: Category) => {
    if (isService) {
      return servicesMap[cat.categories_id] || [];
    }
    return cat.subcategories;
  };

  // const filteredCategories = categories.filter(cat => {
  //   const subcats = getSubcategories(cat);
  //   return (
  //     cat.categories_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     subcats.some(sub => sub.subcategory_name.toLowerCase().includes(searchQuery.toLowerCase()))
  //   );
  // });
  const filteredCategories = categories.filter(cat =>
    cat.categories_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subcategories.some(sub => sub.subcategory_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.categories_id));

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    return url.replace(/\s*\)\s*$/, '').trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upleex-purple"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-10 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 min-h-screen">

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-32">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={isService ? "Search services..." : "Search categories..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upleex-purple/20 focus:border-upleex-purple transition-all text-sm"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredCategories.map((cat) => (
                    <label
                      key={cat.categories_id}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${selectedCategoryIds.includes(cat.categories_id)
                          ? 'bg-purple-50 text-upleex-purple'
                          : 'hover:bg-gray-50 text-slate-600'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${selectedCategoryIds.includes(cat.categories_id)
                              ? 'bg-upleex-purple'
                              : 'bg-transparent'
                            }`}
                        />
                        <span className="font-medium text-sm">
                          {cat.categories_name}
                        </span>
                      </div>
                      <Checkbox
                        checked={selectedCategoryIds.includes(cat.categories_id)}
                        onCheckedChange={() => toggleCategory(cat.categories_id)}
                        className="border-gray-300 data-[state=checked]:bg-upleex-purple data-[state=checked]:border-upleex-purple"
                      />
                    </label>
                  ))}
                </div>

              </div>
            </div>
          </div>

          {/* Main Area */}
            <div className="lg:w-3/4">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((cat) => (
                    <motion.div
                      key={cat.categories_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100"
                    >
                      {/* Header */}
                      <div
                        className={`flex items-center justify-between ${
                          Number(cat.product_count) > 0 ? "pb-2 mb-4 border-b border-gray-100" : "pb-0 mb-0"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            {cat.image && (
                              <img
                                src={sanitizeUrl(cat.image)}
                                alt={cat.categories_name}
                                width={24}
                                height={24}
                                className="object-contain"
                                loading="lazy"
                              />
                            )}
                          </div>

                          <div className="space-y-1">
                            <h2 className="text-xl font-bold text-slate-900">
                              {cat.categories_name}
                            </h2>
                            <p className="text-sm text-slate-500">
                              {cat.subcategories.length} Subcategories
                            </p>
                          </div>
                        </div>

                        <Link
                          href={isService ? `/services-list?category=${cat.categories_id}` : `/rent/${createSlug(!selectedCity || selectedCity === 'Select City' ? 'surat' : selectedCity.includes('-') ? (selectedCity.split('-').pop() || 'surat') : selectedCity)}/${createSlug(cat.slug || cat.categories_name || 'category')}`}
                          className="text-upleex-purple text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          View All <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      {/* Subcategories / Services Grid */}
                      {isService && servicesLoadingMap[cat.categories_id] ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-8">
                          {Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse flex flex-col items-center">
                              <div className="bg-gray-200 h-40 w-full rounded-2xl mb-3"></div>
                              <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : getSubcategories(cat).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                          {getSubcategories(cat).map((sub) => (
                            <Link
                              key={sub.subcategory_id}
                              href={isService ? `/service/${sub.subcategory_id}` : `/rent/${createSlug(!selectedCity || selectedCity === 'Select City' ? 'surat' : selectedCity.includes('-') ? (selectedCity.split('-').pop() || 'surat') : selectedCity)}/${createSlug(cat.slug || cat.categories_name || 'category')}?sub=${createSlug(sub.slug || sub.subcategory_name || 'subcategory')}`}
                              className="group"
                            >
                              <div className="relative h-40 w-full rounded-2xl mb-3 overflow-hidden bg-gray-100">
                                {sub.image && (
                                  <img
                                    src={sanitizeUrl(sub.image)}
                                    alt={sub.subcategory_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                              <h3 className="text-sm font-bold text-slate-800 text-center group-hover:text-upleex-purple transition-colors">
                                {sub.subcategory_name}
                              </h3>
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      No Category Selected
                    </h3>
                    <p className="text-slate-500">
                      Please select at least one category from the sidebar to view subcategories.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-upleex-purple"></div>
      </div>
    }>
      <CategoriesPageContent />
    </Suspense>
  );
}

