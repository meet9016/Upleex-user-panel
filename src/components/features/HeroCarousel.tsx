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

interface HeroCarouselProps {
  banners: Banner[];
}

export const HeroCarousel = ({ banners }: HeroCarouselProps) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

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

  if (!banners || banners.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 sm:py-8 overflow-hidden bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Carousel Container */}
        <div className="relative h-[300px] sm:h-[500px] lg:h-[550px] w-full max-w-full mx-auto mt-2 sm:mt-4 flex items-center justify-center perspective-1000">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute -left-2 sm:left-2 lg:-left-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/90 shadow-xl hover:bg-white transition-all text-slate-800 backdrop-blur-md cursor-pointer group"
          >
            <ChevronLeft size={24} className="sm:hidden" />
            <ChevronLeft size={28} className="hidden sm:block group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-2 sm:right-2 lg:-right-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/90 shadow-xl hover:bg-white transition-all text-slate-800 backdrop-blur-md cursor-pointer group"
          >
            <ChevronRight size={24} className="sm:hidden" />
            <ChevronRight size={28} className="hidden sm:block group-hover:translate-x-0.5 transition-transform" />
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
                    scale: isActive ? 1 : (isHidden ? 0.85 : 0.94),
                    opacity: isActive ? 1 : (isHidden ? 0 : 0.6),
                    x: isActive ? '0%' : (isPrev ? '-85%' : (isNext ? '85%' : '0%')),
                    zIndex: isActive ? 30 : (isHidden ? 10 : 20),
                    filter: isActive ? 'blur(0px)' : 'blur(2px)',
                    rotateY: isPrev ? 15 : (isNext ? -15 : 0)
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

                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 text-white">
                      <div className={`transition-all duration-700 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        {banner.subtitle && (
                          <p className="text-xs sm:text-sm md:text-lg font-bold text-blue-200 mb-2 sm:mb-4 tracking-[0.2em]">
                            {banner.subtitle}
                          </p>
                        )}
                        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-[1.1] max-w-2xl">
                          {banner.title}
                        </h2>
                        {banner.description && (
                          <p className="text-gray-200 text-sm sm:text-base lg:text-lg max-w-lg mb-6 sm:mb-10 line-clamp-2 md:line-clamp-3 leading-relaxed">
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