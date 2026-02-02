"use client";
import { Button } from '@/components/ui/Button';
import { CategoryCard } from '@/components/features/CategoryCard';
import { ProductCard } from '@/components/features/ProductCard';
import { categories, featuredProducts } from '@/data/mockData';
import { ArrowRight, CheckCircle, Shield, Clock, Activity, Sparkles, Zap, TrendingUp, Star, ChevronRight, ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import endPointApi from '@/utils/endPointApi';
import { api } from '@/utils/axiosInstance';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';

interface Category {
  id: number;
  categories_name: string;
  image: string;
  categories_id: string;
  product_count?: number;
}

interface CategoryResponse {
  all_categories: Category[];
}

// Add floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          initial={{
            x: Math.random() * 100 + 'vw',
            y: Math.random() * 100 + 'vh',
          }}
          animate={{
            y: [null, -20, 20, -10, 10],
            x: [null, 10, -10, 5, -5],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Add gradient background component
const GradientBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-upleex-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-upleex-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-upleex-purple/10 to-upleex-blue/10 rounded-full blur-3xl"></div>
    </div>
  );
};

// Add animated counter component
const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const increment = end / (duration * 60);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{Math.floor(count).toLocaleString()}+</span>;
};

export default function Home() {
  const [categoryList, setCategoryList] = useState<CategoryResponse | null>(null);
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
    const fetchCategories = async () => {
      try {
        const res = await api.post(endPointApi.home, {});
        setCategoryList(res.data.data);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white overflow-hidden" ref={containerRef} suppressHydrationWarning={true}>
      <FloatingParticles />

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50/40 min-h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50/50 -z-10" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32">
            <div className="text-center md:text-left md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 space-y-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-upleex-blue text-sm font-semibold mb-2">
                  <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                  #1 Rental Marketplace in India
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  Don't Buy. <span className="text-transparent bg-clip-text bg-gradient-to-r from-upleex-purple to-upleex-blue">Just Rent It.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto md:mx-0">
                  Access premium lifestyle products without the commitment. From furniture to fitness, rent everything you need at a fraction of the cost.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <Button size="lg" className="rounded-full px-8 shadow-blue-500/20 shadow-xl">
                    Explore Products
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/50">
                    Become a Seller
                  </Button>
                </div>

                <div className="pt-8 flex items-center justify-center md:justify-start gap-8 text-slate-500 text-sm font-medium">
                  <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Verified Products</div>
                  <div className="flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Free Delivery</div>
                </div>
              </div>

              <div className="mt-12 md:mt-0 md:w-1/2 relative">
                <div className="relative z-10 w-full rounded-2xl bg-white shadow-2xl p-4 md:p-6 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern Living Room"
                    className="rounded-xl w-full h-64 md:h-80 object-cover"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">Modern Living Setup</h3>
                      <p className="text-gray-500 text-sm">Full Room Package</p>
                    </div>
                    <Button size="sm">Rent @ ₹2499/mo</Button>
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Categories Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-upleex-blue text-sm font-semibold mb-4">
                <Zap className="w-4 h-4" />
                Popular Categories
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-upleex-purple to-upleex-blue">Premium</span> Collection
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">Find exactly what you are looking for from our wide range of rental categories.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8">
              {categoryList?.all_categories?.map((cat, index) => (
                <motion.div
                key={`${cat.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  onMouseEnter={() => setActiveCategory(cat.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <CategoryCard
                    {...cat}
                    className={`transform transition-all duration-300 ${activeCategory === cat.id
                      ? 'shadow-2xl shadow-purple-500/20 ring-2 ring-purple-500/20'
                      : 'hover:shadow-xl hover:shadow-blue-500/10'
                      }`}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <Button
                variant="outline"
                className="rounded-full px-8 py-6 border-2 group"
              >
                <span className="flex items-center gap-2">
                  View All Categories
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Featured Products */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-50 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16"
            >
              <div>

                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                  Trending Rentals
                </h2>
                <p className="text-slate-500 text-lg">Popular items being rented right now. Don't miss out!</p>
              </div>
              <Button
                variant="ghost"
                className="mt-6 md:mt-0 rounded-full px-8 py-6
             bg-gradient-to-r from-blue-50 to-indigo-50
             text-upleex-blue hover:text-indigo-700
             hover:shadow-md transition-all group"
              >
                <span className="flex items-center gap-2">
                  View All
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
                </span>
              </Button>

            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <ProductCard
                    product={product}
                    className="transform transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Props / Why Choose Us */}
        <section className="py-24 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
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
                  Quality Assured
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-500 leading-relaxed"
                >
                  Every product is quality checked, sanitized, and maintained to ensure you get the best experience.
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
                  animate={{
                    rotate: [0, 5, -5, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 rounded-2xl bg-purple-50 text-upleex-purple flex items-center justify-center mb-6 shadow-lg"
                >
                  <Clock size={32} />
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-slate-900 mb-3"
                >
                  Flexible Tenure
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-500 leading-relaxed"
                >
                  Rent for a month or a year. Upgrade or return anytime. You choose what works for you.
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
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                  className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 shadow-lg"
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
                  Free Maintenance
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-slate-500 leading-relaxed"
                >
                  We take care of repairs and maintenance throughout your rental period at no extra cost.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        </section>
       {/* CTA Section */}
       <section className="py-24">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl
                 bg-gradient-to-br from-upleex-dark via-slate-900 to-slate-800
                 px-8 py-14 md:px-16 md:py-20
                 text-center text-white shadow-2xl"
    >
      {/* Decorative glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-upleex-blue/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-upleex-purple/20 rounded-full blur-3xl" />

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
          className="text-3xl md:text-5xl font-bold leading-tight"
        >
          Ready to upgrade your lifestyle?
        </motion.h2>

        {/* Description */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          className="text-lg md:text-xl text-slate-300"
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
          className="pt-6"
        >
          <Button
            size="lg"
            className="rounded-full px-10 py-6
                       bg-white text-slate-900 text-lg
                       hover:bg-slate-100
                       shadow-xl transition-all"
          >
            Start Renting Now
          </Button>
        </motion.div>

      </motion.div>
    </motion.div>
  </div>
</section>

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
