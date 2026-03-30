import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

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

export const HeroCarousel = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get(endPointApi.bannerList);
        if (res.data?.success && res.data?.data) {
          const activeBanners = res.data.data.filter((b: any) => b.status === 'active');
          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          }
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    let rafId: number;
    let lastTime = performance.now();
    const intervalMs = 9500; // 9.5 seconds

    const tick = (now: number) => {
      if (now - lastTime >= intervalMs) {
        setActiveIndex((prev) => (prev + 1) % banners.length);
        lastTime = now;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [banners.length]);

  const handleNext = () => {
    if (banners.length === 0) return;
    setActiveIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    if (banners.length === 0) return;
    setActiveIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "";
    if (imagePath.startsWith('http')) return imagePath;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    if (imagePath.startsWith('/uploads')) {
      return `${baseUrl}${imagePath}`;
    }
    return imagePath;
  };

  if (loading || banners.length === 0) {
    if (loading) {
      return (
        <div className="w-full h-[400px] md:h-[500px] bg-gray-100 animate-pulse flex items-center justify-center">
          <span className="text-gray-400">Loading Banners...</span>
        </div>
      );
    }
    return null;
  }

  return (
    <section className="w-full py-8 overflow-hidden bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Carousel Container */}
        <div className="relative h-[400px] md:h-[500px] w-full max-w-full mx-auto mt-4 flex items-center justify-center perspective-1000">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 shadow-xl hover:bg-white transition-all text-slate-800 backdrop-blur-md cursor-pointer"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-white/80 shadow-xl hover:bg-white transition-all text-slate-800 backdrop-blur-md cursor-pointer"
          >
            <ChevronRight size={28} />
          </button>

          {/* Slides */}
          <div className="relative w-full h-full flex items-center justify-center">
            {banners.map((banner, index) => {
              let position = 0;
              if (index === activeIndex) position = 0;
              else if (index === (activeIndex - 1 + banners.length) % banners.length) position = -1;
              else if (index === (activeIndex + 1) % banners.length) position = 1;
              else position = 2;

              const isActive = position === 0;
              const isPrev = position === -1;
              const isNext = position === 1;
              const isHidden = position === 2;

              // On mobile, we might want a simpler transition or different layout
              return (
                <motion.div
                  key={banner._id || banner.id}
                  className={`absolute w-[88%] md:w-[82%] h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${isHidden ? 'pointer-events-none' : ''}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : (isHidden ? 0.85 : 0.92),
                    opacity: isActive ? 1 : (isHidden ? 0 : 0.6),
                    x: isActive ? '0%' : (isPrev ? '-100%' : (isNext ? '100%' : '0%')),
                    zIndex: isActive ? 30 : (isHidden ? 10 : 20),
                    filter: isActive ? 'blur(0px)' : 'blur(2px)'
                  }}
                  transition={{
                    duration: 0.8,
                    ease: "circOut",
                  }}
                  style={{ 
                    willChange: "transform, opacity",
                    display: isHidden ? 'none' : 'block' 
                  }}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    if (isNext) handleNext();
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={getImageUrl(banner.image)}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.color || 'bg-blue-900'} opacity-80 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-end md:justify-center p-6 md:p-12 text-white">
                      <div className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {banner.subtitle && (
                          <p className="text-sm md:text-lg font-medium text-blue-200 mb-3 uppercase tracking-widest">
                            {banner.subtitle}
                          </p>
                        )}
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-5 leading-tight max-w-lg">
                          {banner.title}
                        </h2>
                        {banner.description && (
                          <p className="text-gray-200 text-sm md:text-base max-w-md mb-8 line-clamp-2">
                            {banner.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicators */}
        <div className="flex justify-center gap-3 mt-10">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-3 rounded-full transition-all duration-400
                ${i === activeIndex
                  ? 'w-10 bg-slate-900 shadow-md'
                  : 'w-3 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};