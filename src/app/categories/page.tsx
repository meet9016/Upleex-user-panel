'use client';

import React, { useEffect, useState } from 'react';
import { categoryService, Category, SubCategory } from '@/services/categoryService';
import { Checkbox } from '@/components/ui/Checkbox';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
        // Select the first category by default if none selected
        if (data.length > 0 && selectedCategoryIds.length === 0) {
          setSelectedCategoryIds([data[0].categories_id]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  const filteredCategories = categories.filter(cat => 
    cat.categories_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.subcategories.some(sub => sub.subcategory_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedCategories = categories.filter(cat => selectedCategoryIds.includes(cat.categories_id));

  const sanitizeUrl = (url: string) => {
    if (!url) return '';
    // Remove trailing parenthesis or spaces that might come from API
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Browse All Sub Categories
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Select multiple categories to view their subcategories
          </p>
        </div> */}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-upleex-purple/20 focus:border-upleex-purple transition-all text-sm"
                />
              </div>

              <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCategories.map((cat) => (
                  <label
                    key={cat.categories_id}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      selectedCategoryIds.includes(cat.categories_id)
                        ? 'bg-purple-50 text-upleex-purple'
                        : 'hover:bg-gray-50 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${selectedCategoryIds.includes(cat.categories_id) ? 'bg-upleex-purple' : 'bg-transparent'}`} />
                      <span className="font-medium text-sm">{cat.categories_name}</span>
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

          {/* Main Area */}
          <div className="lg:w-3/4">
            <div className="space-y-12">
              <AnimatePresence mode="popLayout">
                {selectedCategories.length > 0 ? (
                  selectedCategories.map((cat) => (
                    <motion.div
                      key={cat.categories_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                            <Image
                              src={sanitizeUrl(cat.image)}
                              alt={cat.categories_name}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-slate-900">{cat.categories_name}</h2>
                            <p className="text-sm text-slate-500">{cat.subcategories.length} Subcategories</p>
                          </div>
                        </div>
                        <Link 
                          href={`/rent-category/${cat.categories_id}`}
                          className="text-upleex-purple text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          View All <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.subcategory_id}
                            href={`/rent-category/${cat.categories_id}?sub=${sub.subcategory_id}`}
                            className="group"
                          >
                            <div className="relative aspect-square rounded-2xl bg-orange-50 p-6 mb-3 transition-all group-hover:shadow-lg group-hover:shadow-orange-200/50 group-hover:-translate-y-1 overflow-hidden">
                              <Image
                                src={sanitizeUrl(sub.image)}
                                alt={sub.subcategory_name}
                                fill
                                className="object-contain p-4 transition-transform group-hover:scale-110"
                              />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 text-center group-hover:text-upleex-purple transition-colors">
                              {sub.subcategory_name}
                            </h3>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Category Selected</h3>
                    <p className="text-slate-500">Please select at least one category from the sidebar to view subcategories.</p>
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
