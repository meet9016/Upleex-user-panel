import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

const BLOGS = [
  {
    id: 1,
    title: "Why is a washing machine on rent the Best Option...",
    description: "Choosing a washing machine on rent is a practical solution for urban homes. It offers flexibility, l...",
    image: "https://images.unsplash.com/photo-1626806775351-538af8193c1c?q=80&w=2070&auto=format&fit=crop",
    category: "Washing Machine"
  },
  {
    id: 2,
    title: "Is Musical Instrument Rental Near me a good idea",
    description: "Thinking of renting instead of buying a musical instrument? This guide explains why musical instrume...",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop",
    category: "Musical Instrument"
  },
  {
    id: 3,
    title: "Why Should You Choose Air Purifiers on Rent for...",
    description: "Air purifiers on rent offer an affordable and flexible way to breathe cleaner air at home or work. N...",
    image: "https://images.unsplash.com/photo-1585776245991-cf79dd40e7da?q=80&w=2072&auto=format&fit=crop",
    category: "Air Purifiers"
  },
  {
    id: 4,
    title: "Why Renting Fitness Equipment is the Smart Choice",
    description: "Renting fitness equipment makes home workouts affordable, flexible, and stress-free. Get high-qualit...",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    category: "Fitness Equipment"
  }
];

export const LatestBlogs = () => {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 flex items-center justify-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-upleex-purple to-upleex-blue bg-clip-text text-transparent text-center">Latest Blogs</h2>
          <div className="absolute right-0 hidden md:block">
            <Button variant="outline" className="rounded-full px-6">
              View All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BLOGS.map((blog) => (
            <div key={blog.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-4 shadow-lg">
                <div className="aspect-square bg-gray-100">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {/* Overlay Text similar to screenshot */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                   <p className="text-white font-semibold text-sm">
                      Why Is <span className="text-orange-400">{blog.category}</span> on Rent the Best Option
                   </p>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#0ea5e9] group-hover:bg-clip-text group-hover:text-transparent transition-all line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                {blog.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
