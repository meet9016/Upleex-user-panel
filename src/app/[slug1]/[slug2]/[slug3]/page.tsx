'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/features/ProductCard';
import { categories as mockCategories } from '@/data/mockData';
import { ArrowRight, ChevronDown, ArrowUpDown, Calendar, Check, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';
import { Pagination } from '@/components/ui/Pagination';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useCity } from '@/hooks/useCity';
import { productService } from '@/services/productService';
import { categoryService, Category } from '@/services/categoryService';
import { motion } from 'framer-motion';

import { CategorySEOContent, type CategorySeoContentData } from '@/components/features/CategorySEOContent';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { createSlug, extractIdFromSlug } from '@/utils/helper';

export default function RentCategoryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RentCategoryContent />
    </Suspense>
  );
}

function RentCategoryContent() {
  const params = useParams();
  
  const typeParam = params?.slug1 as string;
  const cityParam = params?.slug2 as string;
  const slugParam = params?.slug3 as string;
  const slug = extractIdFromSlug(slugParam); // Extract ID from SEO slug

  const [activeFilter, setActiveFilter] = useState('all');
  const [isCategory, setIsCategory] = useState(false);
  const [isSubcategory, setIsSubcategory] = useState(false);
  const [parentCategory, setParentCategory] = useState<Category | null>(null);
  const [currentCatOrSub, setCurrentCatOrSub] = useState<any>(null);

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
    { label: 'Hourly', value: '3' },
  ]);

  const [categoryList, setCategoryList] = useState<any[]>([]); // For the filter bar
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEmpty, setShowEmpty] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rotationSeed, setRotationSeed] = useState(() => Math.floor(Date.now() / (2 * 60 * 1000)));
  const [categorySeoContent, setCategorySeoContent] = useState<CategorySeoContentData | null>(null);
  const [categoryImage, setCategoryImage] = useState('');
  const ITEMS_PER_PAGE = 12;
  const defaultCity = useCity();
  const selectedCity = cityParam || defaultCity;

  const sortDropdownRef = useRef<HTMLDivElement | null>(null);
  const tenureDropdownRef = useRef<HTMLDivElement | null>(null);

  const sellSortOptions = [
    { label: 'All Products', value: '0' },
    { label: 'Price: Low to High', value: 'Price: Low to High' },
    { label: 'Price: High to Low', value: 'Price: High to Low' },
    { label: 'Product: New', value: 'Product: New' },
    { label: 'Product: Old', value: 'Product: Old' }
  ];

  const currentTenureOptions = selectedSort.value === '2' ? sellSortOptions : tenureOptions;

  useEffect(() => {
    let isCancelled = false;
    const identifySlug = async () => {
      try {
        const allCategories = await categoryService.getCategories(selectedCity);
        if (isCancelled) return;

        let foundIsCat = false;
        let foundIsSub = false;
        let foundParent: Category | null = null;
        let foundCurrent = null;

        const catMatch = allCategories.find(c => c.slug === slug || extractIdFromSlug(c.slug || '') === slug || c.categories_id === slug);
        if (catMatch) {
            foundIsCat = true;
            foundCurrent = catMatch;
            setActiveFilter('all');
            setCategoryList(catMatch.subcategories || []);
        } else {
            for (const cat of allCategories) {
                const subMatch = cat.subcategories?.find(s => s.slug === slug || extractIdFromSlug(s.slug || '') === slug || s.subcategory_id === slug);
                if (subMatch) {
                    foundIsSub = true;
                    foundParent = cat;
                    foundCurrent = subMatch;
                    setActiveFilter(subMatch.slug || subMatch.subcategory_id);
                    setCategoryList(cat.subcategories || []);
                    break;
                }
            }
        }

        setIsCategory(foundIsCat);
        setIsSubcategory(foundIsSub);
        setParentCategory(foundParent);
        setCurrentCatOrSub(foundCurrent);

        if (foundCurrent) {
            setCategoryImage(foundCurrent.image || '');
            if ('seo_content' in foundCurrent && (foundCurrent as any).seo_content) {
                setCategorySeoContent((foundCurrent as any).seo_content);
            } else if (foundIsCat && (foundCurrent as Category).seo_content) {
                setCategorySeoContent((foundCurrent as Category).seo_content || null);
            } else {
                setCategorySeoContent(null);
            }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (slug) {
        identifySlug();
    }
    return () => { isCancelled = true; };
  }, [slug, selectedCity]);

  // Dynamic filter categories: "All" + API data
  const filterCategories = [
    { name: 'All', slug: 'all' },
    ...(categoryList?.map((cat: any) => ({
      name: cat.subcategory_name || cat.name,
      slug: cat.slug || createSlug(cat.subcategory_name || cat.name),
      image: cat.image
    })) || [])
  ];

  useEffect(() => {
    let isCancelled = false;

    const fetchProducts = async () => {
      if (!currentCatOrSub && !parentCategory) return;
      setLoading(true);
      try {
        const payloadParams: any = {
          city: selectedCity,
          filter_rent_sell: selectedSort.value,
          filter_tenure: selectedTenure.value,
          page: currentPage,
          rotation_seed: rotationSeed,
        };

        if (isCategory && currentCatOrSub) {
            payloadParams.category_id = currentCatOrSub.categories_id;
            payloadParams.sub_category_id = 'all';
        } else if (isSubcategory && parentCategory && currentCatOrSub) {
            payloadParams.category_id = parentCategory.categories_id;
            payloadParams.sub_category_id = currentCatOrSub.subcategory_id;
        } else {
            payloadParams.category_id = slug;
        }

        const res = await productService.getCategoryProducts(payloadParams);

        if (isCancelled) return;

        const payload = res?.data;
        const root = res || {};

        if (Array.isArray(payload)) {
          setProductList(payload);
          const totalFromRoot = root.product_count ?? root.total_items ?? root.total_count ?? root.total ?? null;
          const lastPageFromRoot = root.last_page ?? root.total_pages ?? root.pages ?? null;
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
            const hasFullPage = payload.length >= ITEMS_PER_PAGE;
            setProductCount(null);
            setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
          }
        } else {
          const products = Array.isArray(payload?.product_data) ? payload.product_data : [];
          setProductList(products);
          const pagination = payload?.pagination || payload?.pager || null;
          const countRaw = payload?.product_count ?? pagination?.total ?? pagination?.total_items ?? pagination?.total_count ?? null;
          const lastPageRaw = payload?.total_pages ?? payload?.last_page ?? pagination?.total_pages ?? pagination?.last_page ?? null;

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
        if (isCancelled) return;
        setProductList([]);
        setProductCount(null);
        setTotalPages(1);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    if (slug && (isCategory || isSubcategory)) {
      fetchProducts();
    }

    return () => {
      isCancelled = true;
    };
  }, [slug, isCategory, isSubcategory, currentCatOrSub, parentCategory, activeFilter, selectedSort, selectedTenure, currentPage, selectedCity, rotationSeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotationSeed(Math.floor(Date.now() / (2 * 60 * 1000)));
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [slug, activeFilter, selectedSort, selectedTenure, selectedCity]);

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

  useEffect(() => {
    if (selectedSort.value === '2') {
      setSelectedTenure({ label: 'All Products', value: '0' });
    } else {
      setSelectedTenure({ label: 'All Durations', value: '0' });
    }
  }, [selectedSort.value]);

  const router = useRouter();

  const handleFilterClick = (filterSlug: string) => {
    if (filterSlug === 'all') {
      if (isSubcategory && parentCategory) {
          router.push(`/${typeParam}/${cityParam}/${parentCategory.slug || createSlug(parentCategory.categories_name)}`);
      } else {
          router.push(`/${typeParam}/${cityParam}/${slugParam}`);
      }
    } else {
      router.push(`/${typeParam}/${cityParam}/${filterSlug}`);
    }
  };

  const currentCategoryName = filterCategories.find(c => c.slug === activeFilter)?.name || 'Products';
  const filteredProducts = productList;

  useEffect(() => {
    if (!loading && filteredProducts.length === 0) {
      const timer = setTimeout(() => setShowEmpty(true), 400); 
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [loading, filteredProducts.length]);

  const breadcrumbItems = [];
  if (isCategory && currentCatOrSub) {
      breadcrumbItems.push({ label: currentCatOrSub.categories_name });
  } else if (isSubcategory && parentCategory && currentCatOrSub) {
      breadcrumbItems.push({ 
          label: parentCategory.categories_name, 
          href: `/${typeParam}/${cityParam}/${parentCategory.slug || createSlug(parentCategory.categories_name)}` 
      });
      breadcrumbItems.push({ label: currentCatOrSub.subcategory_name });
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50" style={{ overflowX: 'clip' }}>
      
      <div className="w-full bg-white border-b-2 border-purple-50 sticky top-[140px] lg:top-[128px] z-[49] shadow-md backdrop-blur-none transition-all" style={{ position: 'sticky' }}>
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-4">
            {filterCategories.map((cat) => {
              const matchedCat = mockCategories.find(c => c.slug === cat.slug);
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

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-2">
            <BackButton/>
        </div>
        <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="relative z-[48] flex flex-col sm:flex-row justify-between items-center w-full mb-8 gap-4 px-1">
          <div className="text-slate-600 font-bold text-base sm:text-lg w-full sm:w-auto text-left">
            {productCount !== null ? (
              <span>Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, productCount)}-{Math.min(currentPage * ITEMS_PER_PAGE, productCount)} of {productCount} products</span>
            ) : (
              <span>{filteredProducts.length} products found</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto justify-end">
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
                  {selectedSort.value === '2' ? <ArrowUpDown size={18} /> : <Calendar size={18} />}
                </span>
                <span className="truncate">{selectedTenure.label}</span>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isTenureOpen ? 'rotate-180 text-upleex-purple' : ''}`} />
            </button>

            <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-300 origin-top ${
              isTenureOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none '
            }`}>
              <div className="p-1.5">
                {currentTenureOptions.map((option) => (
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
        </div>

        {loading && filteredProducts.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        )}

        {showEmpty && (
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
                  className="w-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}

        <CategorySEOContent content={categorySeoContent} />
      </div>
    </div>
  );
}
