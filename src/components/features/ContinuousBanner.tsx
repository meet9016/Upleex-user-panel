import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Tag, Clock, Truck, ShieldCheck, Percent } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const OFFERS = [
  {
    id: 1,
    title: "Furniture Sale",
    subtitle: "Up to 50% Off",
    description: "Premium sofas and beds at half price.",
    color: "from-blue-600 to-indigo-600",
    icon: <Sparkles className="w-6 h-6 text-yellow-300" />,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Work From Home",
    subtitle: "Complete Setup",
    description: "Ergonomic chairs & desks starting ₹299.",
    color: "from-purple-600 to-pink-600",
    icon: <Clock className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Fitness Gear",
    subtitle: "Get Fit Now",
    description: "Treadmills & cycles delivered today.",
    color: "from-orange-500 to-red-500",
    icon: <Truck className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Appliances",
    subtitle: "Combo Offers",
    description: "Fridge + Washing Machine deals.",
    color: "from-emerald-500 to-teal-500",
    icon: <Percent className="w-6 h-6 text-white" />,
    image: "https://images.unsplash.com/photo-1581578731117-10d52143b0d8?q=80&w=2070&auto=format&fit=crop"
  }
];

export const ContinuousBanner = () => {
  return (
    <section className="w-full py-8 md:py-12 overflow-hidden bg-gradient-to-r from-gray-50 to-white">
      <div className="max-w-[1920px] mx-auto">
        <div className="mb-8 px-4 md:px-8 max-w-7xl mx-auto">
             <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="text-red-500 font-bold text-sm tracking-wide uppercase">Live Offers</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                Exclusive <span className="text-gradient-primary">Limited Time</span> Deals
             </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative flex w-full">
            {/* Gradient Masks for smooth fade out at edges */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>

            <motion.div
              className="flex gap-6 md:gap-8 px-4"
              animate={{
                x: [0, -100 * OFFERS.length * 4] // Approximate movement, better to use percentage or measure
              }}
              style={{
                width: "max-content"
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate the list multiple times to ensure smooth scrolling on large screens */}
              {[...OFFERS, ...OFFERS, ...OFFERS, ...OFFERS].map((offer, index) => (
                <div 
                    key={`${offer.id}-${index}`}
                    className="relative w-[300px] md:w-[400px] h-[220px] md:h-[260px] flex-shrink-0 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                >
                    <img 
                        src={offer.image} 
                        alt={offer.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${offer.color} opacity-80 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                        <div className="flex justify-between items-start">
                            <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg border border-white/10">
                                {offer.icon}
                            </div>
                            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">
                                LIMITED
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-indigo-200 font-medium text-sm mb-1 uppercase tracking-wider">{offer.subtitle}</p>
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{offer.title}</h3>
                            <p className="text-gray-200 text-sm md:text-base line-clamp-2 opacity-90">{offer.description}</p>
                        </div>
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Button className="rounded-full bg-white text-black hover:bg-gray-100 border-0">
                                Shop Now <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
              ))}
            </motion.div>
        </div>
      </div>
    </section>
  );
};
