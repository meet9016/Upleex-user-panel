'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Store, PackageOpen, ArrowUpDown, Calendar, ChevronDown, Check, Share2, Copy, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ProductCard } from '@/components/features/ProductCard';
import { BackButton } from '@/components/ui/BackButton';
import { Pagination } from '@/components/ui/Pagination';
import { productService } from '@/services/productService';
import { useAppSelector } from '@/redux/hooks';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export default function SellerPage() {
  const searchParams = useSearchParams();
  console.log("searchParams",searchParams)
  const vendorId = searchParams?.get('vendor_id') ?? '';
  const vendorNameFromQuery = searchParams?.get('business_name') ?? null;
  const { user } = useAppSelector((state) => state.auth);

  const [vendorName, setVendorName] = useState<string | null>(vendorNameFromQuery);
  const [vendor, setVendor] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [vendorVideos, setVendorVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isTenureOpen, setIsTenureOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState({ label: 'All Types', value: '0' });
  const [selectedTenure, setSelectedTenure] = useState({ label: 'All Durations', value: '0' });
  const [referralLink, setReferralLink] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const [isReferralCopied, setIsReferralCopied] = useState(false);
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
          page: currentPage,
          limit: ITEMS_PER_PAGE
        });
        console.log("object",res);
        const payload = res?.data;
        console.log("payload",payload);
        const vendorData = res?.vendor;
        setVendor(vendorData);
        const videos = vendorData?.vendor_videos || [];
        setVendorVideos(videos);
        let inferredVendorName: string | null = null;

        if (Array.isArray(payload)) {
          setProducts(payload);
          inferredVendorName = vendorData?.business_name || null;

          const hasFullPage = payload.length >= ITEMS_PER_PAGE;
          setProductCount(payload.length || null);
          setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
        } else {
          const data = payload || {};
          const productData = Array.isArray(data.product_data) ? data.product_data : [];
          setProducts(productData);
          inferredVendorName = vendorData?.business_name || null;

          const hasFullPage = productData.length >= ITEMS_PER_PAGE;
          setProductCount(productData.length || null);
          setTotalPages(hasFullPage ? currentPage + 1 : currentPage);
        }

        if (inferredVendorName) {
          setVendorName(inferredVendorName);
        }
      } catch (error) {
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
    if (user) {
      // Generate referral link if user is logged in
      if (typeof window !== 'undefined' && vendorId) {
        const baseUrl = window.location.origin + window.location.pathname;
        const refLink = `${baseUrl}?vendor_id=${vendorId}&ref=${user._id || user.id}`;
        setReferralLink(refLink);
      }
    }
  }, [vendorId, user]);

  const handleCopyProfile = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      toast.success('Profile link copied!');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleCopyReferral = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setIsReferralCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setIsReferralCopied(false), 2000);
    } else {
      toast.error('Please login to get your referral link');
    }
  };

  useEffect(() => {
    if (isFirstFilterLoadRef.current) {
      isFirstFilterLoadRef.current = false;
      return;
    }
    setCurrentPage(1);
  }, [vendorId, selectedSort, selectedTenure]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        <BackButton />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 px-5 sm:px-6 py-3 sm:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4 w-full">
  
  {/* LEFT SIDE */}
  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
    
    <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-50 flex items-center justify-center">
      <Store size={26} className="text-upleex-blue" />
    </div>

    <div className="min-w-0">
      <div className="text-[10px] font-semibold text-gray-500 tracking-[0.15em] mb-0.5">
        Sold By
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate leading-tight">
        {vendorName || 'Vendor'}
      </h1>
      {/* Show vendor mobile if available */}
      {vendor?.vendor_mobile && (
        <div className="text-xs text-blue-600 mt-1">
          📞 {vendor.vendor_mobile}
        </div>
      )}
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="flex flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
    
    {/* ADDRESS ABOVE BUTTONS */}
    {vendor?.vendor_address && (
      <p className="text-xs text-gray-600  text-left lg:text-right max-w-xs ">
        📍 {vendor.vendor_address}
      </p>
    )}

    {/* BUTTONS */}
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopyProfile}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-semibold text-slate-700 hover:border-upleex-blue hover:text-upleex-blue transition"
      >
        {isCopied ? <Check size={16} /> : <Share2 size={16} />}
        <span>{isCopied ? 'Copied' : 'Share'}</span>
      </button>

      {user ? (
        <div
          onClick={handleCopyReferral}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-upleex-blue to-upleex-purple rounded-full text-xs font-semibold text-white cursor-pointer"
        >
          {isReferralCopied ? <Check size={16} /> : <Copy size={16} />}
          <span>{isReferralCopied ? 'Copied' : 'Referral'}</span>
        </div>
      ) : (
        <Link
          href="/auth/login"
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-full text-xs font-semibold text-white"
        >
          <ExternalLink size={16} />
          <span>Login</span>
        </Link>
      )}
    </div>
  </div>
</div>
      
        {vendorVideos.length > 0 && (
          <div className="mt-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-lg font-bold text-slate-900 mb-4">
              Promotional Videos
            </h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
              {vendorVideos.map((video, idx) => (
                <div key={idx} className="flex-none w-[85vw] sm:w-[400px] rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white snap-center relative group">
                  <video 
                    src={video} 
                    controls 
                    className="w-full aspect-video object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-upleex-purple/20 rounded-2xl pointer-events-none transition-colors duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 w-full">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Products from {vendorName || 'Vendor'}
          </h2>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100/80 p-4 sm:p-6 lg:p-8 w-full">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 w-full">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <PackageOpen className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-4">
                  We couldn't find any products for this vendor.
                </p>
                
                {/* Optional: Add suggestion or action buttons */}
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={() => {
                      setSelectedSort({ label: 'All Types', value: '0' });
                      setSelectedTenure({ label: 'All Durations', value: '0' });
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button 
                    onClick={() => window.history.back()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.product_id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="w-full"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                      setCurrentPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showWhenSingle
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
