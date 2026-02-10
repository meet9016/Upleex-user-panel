import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { BLOGS } from '@/data/blogData';

export const LatestBlogs = () => {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative mb-12 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary text-center pb-1">Latest Blogs</h2>
          <div className="absolute right-0 hidden md:block">
            <Button variant="outline" className="rounded-full px-6">
              View All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BLOGS.map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.id}`} className="group cursor-pointer block">
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
                      Why Is <span className="font-bold text-gradient-primary">{blog.category}</span> on Rent the Best Option
                   </p>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#0ea5e9] group-hover:bg-clip-text group-hover:text-transparent transition-all line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                {blog.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
