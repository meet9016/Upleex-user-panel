import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Sample Data for Categories
const CATEGORIES = [
  "Hospital Beds",
  "Wheelchairs",
  "Oxygen Concentrators",
  "CPAP/BiPAP",
  "Patient Monitor",
  "Medical Furniture",
  "Suction Machine"
];

// Sample Data for Banners
const BANNERS = [
  {
    id: 1,
    title: "AS SEEN ON SHARK TANK INDIA",
    subtitle: "Premium Medical Equipment Rentals",
    description: "Get the best care at home with our hospital-grade equipment.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop", // Placeholder
    color: "from-blue-600 to-indigo-700"
  },
  {
    id: 2,
    title: "EXPERT HOME CARE",
    subtitle: "Professional Setup & Support",
    description: "24/7 technical support and express delivery to your doorstep.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop", // Placeholder
    color: "from-emerald-600 to-teal-700"
  },
  {
    id: 3,
    title: "AFFORDABLE PLANS",
    subtitle: "Rent vs Buy Calculator",
    description: "Save up to 70% by renting equipment for short-term recovery.",
    image: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=2070&auto=format&fit=crop", // Placeholder
    color: "from-purple-600 to-violet-700"
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
      scale: 0.8
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
      scale: 0.8
    })
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-8 flex flex-col gap-8">
      
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`
              px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300
              ${activeCategory === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}
            `}
          >
            {cat}
          </button>
        ))}
      </div>

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
            <div className={`w-full h-full rounded-3xl overflow-hidden relative shadow-2xl bg-gradient-to-r ${BANNERS[activeIndex].color}`}>
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 mix-blend-overlay opacity-20">
                <img 
                  src={BANNERS[activeIndex].image} 
                  alt={BANNERS[activeIndex].title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 md:px-20 max-w-4xl mx-auto">
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl font-bold tracking-widest uppercase mb-4 bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full"
                >
                  {BANNERS[activeIndex].subtitle}
                </motion.h3>
                
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                >
                  {BANNERS[activeIndex].title}
                </motion.h2>
                
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl"
                >
                  {BANNERS[activeIndex].description}
                </motion.p>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button className="bg-white text-blue-900 hover:bg-blue-50 border-0 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:scale-105 transition-transform">
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
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BANNERS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Thumbnails (Optional - Visual effect for "Center Mode" context) */}
      <div className="hidden lg:flex justify-between items-center absolute top-1/2 -translate-y-1/2 w-full left-0 px-8 pointer-events-none opacity-50">
         {/* These are just visual cues for the "previous" and "next" items peeking in, 
             actual carousel logic handles the main view. 
             For a true 3-item carousel, the logic would be more complex. 
             For now, this single-item focus with "center mode" feel is robust. */}
      </div>
    </div>
  );
};
