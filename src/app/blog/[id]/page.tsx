'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BLOGS } from '@/data/blogData';
import { Twitter, Linkedin, Share2, Search, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

export default function BlogDetailPage() {
  const params = useParams();
  // Unwrap params if necessary (though in standard usage params.id works directly in many setups, 
  // explicitly handling it safely is better)
  const id = Number(params?.id);
  const blog = BLOGS.find((b) => b.id === id);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <Link href="/">
            <Button>Go Back Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter recent blogs (excluding current one)
  const recentBlogs = BLOGS.filter(b => b.id !== blog.id).slice(0, 5);

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Breadcrumb / Header Meta */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wide">
                    R
                </span>
                <span className="font-medium text-gray-900">{blog.date}</span>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                    <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                {/* Pinterest icon substitute */}
                <button className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                     <span className="font-bold font-serif text-lg leading-none">P</span>
                </button>
                 <button className="p-2 rounded-full hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5 rotate-90" /> {/* Mocking Whatsapp/Share */}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                    {blog.title}
                </h1>

                <div className="rounded-3xl overflow-hidden mb-10 shadow-lg">
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-auto object-cover"
                    />
                </div>

                <div className="prose prose-lg max-w-none text-slate-600">
                    {/* Intro */}
                    <p className="mb-8 text-lg leading-relaxed">
                        {blog.content.intro}
                    </p>

                    {/* Sections */}
                    {blog.content.sections.map((section, index) => (
                        <div key={index} className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">
                                {section.heading}
                            </h2>
                            <p className="leading-relaxed">
                                {section.text}
                            </p>
                        </div>
                    ))}

                    {/* Conclusion */}
                    {blog.content.conclusion && (
                        <div className="mt-12 bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <p className="font-medium text-slate-800 italic">
                                "{blog.content.conclusion}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-10">
                
                {/* Search Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 bg-gradient-primary rounded-full"></div>
                        <h3 className="font-bold text-xl text-slate-900">Search Products</h3>
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search Here..." 
                            className="w-full pl-5 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-primary text-white w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-md">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Recent Blogs Widget */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 bg-gradient-primary rounded-full"></div>
                        <h3 className="font-bold text-xl text-slate-900">Recents Blogs</h3>
                    </div>

                    <div className="space-y-6">
                        {recentBlogs.map((recentBlog, index) => (
                            <Link key={recentBlog.id} href={`/blog/${recentBlog.id}`} className="group block">
                                <div className="flex items-start gap-3">
                                    <span className="text-gray-400 font-medium text-sm mt-1">{index + 1}.</span>
                                    <div>
                                        <h4 className="text-slate-600 group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#0ea5e9] group-hover:bg-clip-text group-hover:text-transparent font-medium transition-all line-clamp-2 text-sm leading-relaxed">
                                            {recentBlog.title}
                                        </h4>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}
