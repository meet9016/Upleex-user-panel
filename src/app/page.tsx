"use client";
import { Button } from '@/components/ui/Button';
import { CategoryCard } from '@/components/features/CategoryCard';
import { ProductCard } from '@/components/features/ProductCard';
import { LatestBlogs } from '@/components/features/LatestBlogs';
import { FAQSection } from '@/components/features/FAQSection';
import { CorporateCustomers } from '@/components/features/CorporateCustomers';
import { PromotionalBanner } from '@/components/features/PromotionalBanner';
import { ContinuousBanner } from '@/components/features/ContinuousBanner';
import { CenterModeCarousel } from '@/components/features/CenterModeCarousel';
import { HeroCarousel } from '@/components/features/HeroCarousel';
import { categories, featuredProducts } from '@/data/mockData';
import { ArrowRight, CheckCircle, Shield, Clock, Activity, Sparkles, Zap, TrendingUp, Star, ChevronRight, ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { categoryService, Category as ServiceCategory, HomeResponse } from '@/services/categoryService';
import { blogService, Blog } from '@/services/blogService';
import { faqService, FAQ } from '@/services/faqService';
import { useRouter } from 'next/navigation';
import { useCity } from '@/hooks/useCity';
import { Skeleton, CategoryCardSkeleton, ProductCardSkeleton, BlogCardSkeleton, HeroCarouselSkeleton } from '@/components/ui/Skeleton';

interface Banner {
  id: string | number;
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  color: string;
  status: string;
}

interface CategoryResponse {
  slider: any[];
  banner: any[];
  all_categories: ServiceCategory[];
}

// Add floating particles component
const FloatingParticles = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 md:opacity-100">
      {[...Array(12)].map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{ x: `${x}vw`, y: `${y}vh` }}
            animate={{ y: ['0vh', '100vh'] }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

export default function Home() {
  const router = useRouter();

  const [categoryList, setCategoryList] = useState<CategoryResponse | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialDataLoaded = useRef(false);
  const selectedCity = useCity();

  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const fetchData = async () => {
      // Only show loader on initial mount or if we have no data yet
      if (!isInitialDataLoaded.current) {
        setIsLoading(true);
      }
      
      try {
        const [categoryData, blogData, faqData, bannerRes] = await Promise.all([
          categoryService.getHomeData(selectedCity),
          blogService.getBlogList(),
          faqService.getFAQList(),
          api.get(endPointApi.bannerList)
        ]);

        setCategoryList(categoryData.data);
        setBlogs(blogData);
        setFaqs(faqData);

        if (bannerRes.data?.success && bannerRes.data?.data) {
          const activeBanners = bannerRes.data.data.filter((b: any) => b.status === 'active');
          setBanners(activeBanners);
        }
        
        isInitialDataLoaded.current = true;
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        // Controlled exit to prevent blinking
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };
    fetchData();
  }, [selectedCity]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-hidden" ref={containerRef} suppressHydrationWarning={true}>
      <FloatingParticles />

      <main className="flex-grow" suppressHydrationWarning={true}>
        

       

       
        {isLoading ? <HeroCarouselSkeleton /> : <HeroCarousel banners={banners} />}

        {/* Enhanced Categories Section */}
        <section className="py-8 sm:py-12 md:py-14 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10 sm:mb-16 md:mb-20"
            >
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton variant="text" height={48} width="60%" className="mx-auto" />
                  <Skeleton variant="text" height={20} width="50%" className="mx-auto" />
                </div>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 sm:mb-6 px-4 tracking-tight">
                    Explore your <span className="text-gradient-primary">Popular</span> Categories
                  </h2>
                  <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg md:text-xl px-4 leading-relaxed">
                  Pick from top categories available in your city.
                  </p>
                </>
              )}
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {isLoading ? (
                Array.from({ length: 12 }).map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))
              ) : (
                [...(categoryList?.all_categories || [])]
                  .sort((a, b) => Number(b.product_count || 0) - Number(a.product_count || 0))
                  .slice(0, 12)
                  .map((category, index) => (
                  <CategoryCard
                    key={category.categories_id}
                    categories_id={category.categories_id}
                    categories_name={category.categories_name}
                    image={category.image}
                    product_count={Number(category.product_count)}
                  />
                ))
              )}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-8 sm:mt-12 md:mt-16"
            >
              <Button
                variant="outline"
                className="rounded-full px-6 sm:px-8 py-4 sm:py-6 border-2 group w-full sm:w-auto"
                onClick={() => router.push('/categories')}
              >
                <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  View All Categories
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </div>
        </section>


       
   {/* CTA Section */}
          <section className="py-16 sm:py-24" suppressHydrationWarning={true}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8" suppressHydrationWarning={true}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl
                  bg-gradient-to-br from-upleex-dark via-slate-900 to-slate-800
                  px-6 py-12 md:px-16 md:py-20
                  text-center text-white shadow-2xl"
              >
                {/* Decorative glow */}
                <div className="absolute -top-30 -right-32 w-96 h-96 bg-upleex-blue/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-upleex-purple/20 rounded-full blur-3xl opacity-50" />

                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    show: {
                      transition: { staggerChildren: 0.15 },
                    },
                  }}
                  className="relative z-10 max-w-3xl mx-auto space-y-6"
                >
                  {/* Heading */}
                  <motion.h2
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight px-2"
                  >
                    Ready to upgrade your lifestyle?
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="text-base sm:text-lg md:text-xl text-slate-300 px-4"
                  >
                    Join thousands of happy customers renting their favorite products on{" "}
                    <span className="text-white font-semibold">Upleex</span>.
                  </motion.p>

                  {/* CTA */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    className="pt-4 sm:pt-6"
                  >
                    <Button
                      size="lg"
                       onClick={() => router.push("/services-list")}
                      className="rounded-full px-8 sm:px-10 py-6
                        bg-white text-slate-900 text-base sm:text-lg
                        hover:bg-slate-100
                        shadow-xl transition-all w-full sm:w-auto"
                    >
                      Explore Services
                    </Button>
                  </motion.div>

                </motion.div>
              </motion.div>
            </div>
          </section>

        {/* Value Props / Why Choose Us */}
        <section className="py-10 bg-white border-t border-gray-100">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center"
            >
              {/* First Feature Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 rounded-2xl bg-blue-50 text-upleex-blue flex items-center justify-center mb-6 shadow-lg"
                >
                  <Shield size={32} />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-slate-900 mb-3"
                >
                  Quality Checked
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-500 leading-relaxed"
                >
                We review listings to keep the platform safe and trusted.
                </motion.p>
              </motion.div>

              {/* Second Feature Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-purple-50 text-upleex-purple flex items-center justify-center mb-6 shadow-lg"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    style={{ originX: 0.5, originY: 0.5 }}
                  >
                    <Clock size={32} />
                  </motion.div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-slate-900 mb-3"
                >
                  Flexible Plans
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-500 leading-relaxed"
                >
                  Choose a rental duration that fits your needs and budget.
                </motion.p>
              </motion.div>

              {/* Third Feature Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 shadow-lg"
                  style={{ originX: 0.5, originY: 0.5 }} // ensure rotation happens from center
                >
                  <Activity size={32} />
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-xl font-bold text-slate-900 mb-3"
                >
                  Easy Support
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-500 leading-relaxed"
                >
                  Get quick help for listings, rentals, and bookings.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <LatestBlogs blogs={blogs} />
        <FAQSection data={faqs} />
        <CorporateCustomers />

      </main>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 200%;
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
