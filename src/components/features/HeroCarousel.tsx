import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  "Hospital Beds", "Home Appliance", "Bikes & Scooters", "Geyser",
  "Wheel Chairs", "Musical Instruments", "AC & Coolers", "Generators", "All Categories"
];

const BANNERS = [
  {
    id: 1,
    title: "Join the Rental Revolution",
    subtitle: "As seen on Shark Tank India",
    description: "Rent furniture, appliances, and more at affordable rates.",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200&auto=format&fit=crop",
    color: "bg-blue-900"
  },
  {
    id: 2,
    title: "Be Smart, Rent Smart",
    subtitle: "Warm winters with Oil Heaters",
    description: "Get premium heaters on rent starting @ ₹499/mo",
    image: "https://images.unsplash.com/photo-1512445239398-6d0c4c575b89?q=80&w=1200&auto=format&fit=crop",
    color: "bg-orange-600"
  },
  {
    id: 3,
    title: "Work From Home Setup",
    subtitle: "Ergonomic Chairs & Desks",
    description: "Boost your productivity with our premium office furniture.",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop",
    color: "bg-slate-800"
  },
  {
    id: 4,
    title: "Fitness at Home",
    subtitle: "Treadmills & Cross Trainers",
    description: "Achieve your fitness goals without buying expensive equipment.",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    color: "bg-emerald-800"
  }
];

export const HeroCarousel = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Home Appliance");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  return (
    <section className="w-full py-8 overflow-hidden bg-gray-50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories - Horizontal Scroll */}
        {/* <div className="flex overflow-x-auto pb-6 gap-2 no-scrollbar justify-start md:justify-center">
          {CATEGORIES.map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border
                ${activeCategory === cat 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {/* Carousel Container */}
        <div className="relative h-[400px] md:h-[500px] w-full max-w-full mx-auto mt-4 flex items-center justify-center perspective-1000">

          {/* Navigation Buttons - Fixed positioning */}
          <button
            onClick={handlePrev}
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all text-slate-700 backdrop-blur-sm cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)' }} /* Added inline style for extra safety */
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all text-slate-700 backdrop-blur-sm cursor-pointer"
            style={{ top: '50%', transform: 'translateY(-50%)' }} /* Added inline style for extra safety */
          >
            <ChevronRight size={24} />
          </button>

          {/* Slides */}
          <div className="relative w-full h-full flex items-center justify-center">
            {BANNERS.map((banner, index) => {
              let position = 0;
              if (index === activeIndex) position = 0;
              else if (index === (activeIndex - 1 + BANNERS.length) % BANNERS.length) position = -1;
              else if (index === (activeIndex + 1) % BANNERS.length) position = 1;
              else position = 2;

              const isActive = position === 0;
              const isPrev = position === -1;
              const isNext = position === 1;
              const isHidden = position === 2;

              return (
                <motion.div
                  key={banner.id}
                  className={`absolute w-[90%] md:w-[85%] h-full rounded-2xl overflow-hidden shadow-2xl cursor-pointer ${isHidden ? 'pointer-events-none' : ''}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : (isHidden ? 0.7 : 0.85),
                    opacity: isActive ? 1 : (isHidden ? 0 : 0.5),
                    x: isActive ? '0%' : (isPrev ? '-60%' : (isNext ? '60%' : '0%')),
                    zIndex: isActive ? 30 : (isHidden ? 10 : 20),
                    filter: isActive ? 'blur(0px)' : (isHidden ? 'blur(5px)' : 'blur(2px)')
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{ willChange: "transform, opacity" }}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    if (isNext) handleNext();
                  }}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} opacity-80 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

                    <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 text-white">
                      <div className={`transition-all duration-500 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <p className="text-sm md:text-lg font-medium text-blue-200 mb-2 uppercase tracking-widest">{banner.subtitle}</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight max-w-lg">
                          {banner.title}
                        </h2>
                        <p className="text-gray-200 text-sm md:text-base max-w-md mb-8 line-clamp-2">
                          {banner.description}
                        </p>
                        {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <Button 
                                    onClick={() => router.push('/membership')}
                                    className="font-bold px-4 py-3 sm:px-8 text-sm sm:text-base cursor-pointer whitespace-nowrap w-full sm:w-auto"
                                >
                                    List Your Product
                                </Button>
                                <Button 
                                    variant="outline" 
                                    onClick={() => router.push('/service')} 
                                    className="border-2 border-white text-white hover:bg-white/10 font-bold px-4 py-3 sm:px-8 text-sm sm:text-base bg-transparent cursor-pointer whitespace-nowrap w-full sm:w-auto"
                                >
                                    List Your Service
                                </Button>
                            </div> */}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 
                ${i === activeIndex ? 'w-8 bg-slate-800' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
