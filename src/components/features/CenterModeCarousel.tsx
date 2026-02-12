import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample Data for Categories
const CATEGORIES = [
  "Laptops & Tech",
  "Living Room",
  "Bedroom",
  "Home Appliances",
  "Office Furniture",
  "Gaming Consoles",
  "Fitness Gear"
];

// Sample Data for Banners
const BANNERS = [
  {
    id: 1,
    title: "PREMIUM ELECTRONICS",
    subtitle: "LATEST TECH RENTALS",
    description: "Upgrade your lifestyle with top-brand laptops, smartphones, and gaming consoles.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", 
    color: "bg-blue-600"
  },
  {
    id: 2,
    title: "MODERN FURNITURE",
    subtitle: "STYLISH INTERIORS",
    description: "Transform your home with our premium sofas, beds, and dining sets. Luxury within reach.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop", 
    color: "bg-orange-500"
  },
  {
    id: 3,
    title: "HOME APPLIANCES",
    subtitle: "HASSLE-FREE LIVING",
    description: "Equip your home with essential appliances like fridges and washing machines without the heavy investment.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop", 
    color: "bg-emerald-600"
  }
];

export const CenterModeCarousel = () => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % BANNERS.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col gap-8">
      
      {/* Carousel Section */}
      <div className="relative h-[400px] md:h-[500px] w-full perspective-1000 overflow-hidden rounded-3xl" ref={containerRef}>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            className="absolute inset-0 w-full h-full"
          >
            <div className="w-full h-full rounded-3xl overflow-hidden relative shadow-2xl bg-gray-900">
              {/* Background Image - Full Visibility */}
              <div className="absolute inset-0">
                <img 
                  src={BANNERS[activeIndex].image} 
                  alt={BANNERS[activeIndex].title} 
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 md:px-20 max-w-4xl mx-auto">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`text-sm md:text-base font-bold tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full ${BANNERS[activeIndex].color}`}
                >
                  {BANNERS[activeIndex].subtitle}
                </motion.div>
                
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight drop-shadow-lg"
                >
                  {BANNERS[activeIndex].title}
                </motion.h2>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl font-medium drop-shadow-md"
                >
                  {BANNERS[activeIndex].description}
                </motion.p>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    className={`${BANNERS[activeIndex].color} text-white hover:brightness-110 border-0 px-10 py-6 text-lg font-bold rounded-xl shadow-xl hover:scale-105 transition-transform`}
                  >
                    Explore Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-black/30 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
