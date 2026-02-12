'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { blogService, Blog, SingleBlogData } from '@/services/blogService';
import { Twitter, Linkedin, Share2, Search, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [blogData, setBlogData] = useState<SingleBlogData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      if (id) {
        setLoading(true);
        const data = await blogService.getSingleBlog(id);
        setBlogData(data);
        setLoading(false);
      }
    };
    fetchBlogDetail();
  }, [id]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="h-12 w-3/4 bg-gray-200 rounded mb-8"></div>
                <div className="h-[400px] md:h-[500px] w-full bg-gray-200 rounded-3xl mb-10"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="lg:col-span-1 space-y-10">
                <div className="h-40 w-full bg-gray-200 rounded-3xl"></div>
                <div className="h-80 w-full bg-gray-200 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blogData || !blogData.blog_data) {
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

  const blog = blogData.blog_data;
  const recentBlogs = blogData.related_blogs || [];

  return (
    <div className="min-h-screen bg-white pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Breadcrumb / Header Meta */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full font-medium text-xs uppercase tracking-wide">
                    {blog.blog_date}
                </span>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="p-2 rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                    <Twitter className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                     <span className="font-bold font-serif text-lg leading-none">P</span>
                </button>
                 <button className="p-2 rounded-full hover:bg-green-50 text-gray-400 hover:text-green-500 transition-colors">
                    <Share2 className="w-5 h-5 rotate-90" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                    {blog.title}
                </h1>

                <div className="rounded-3xl overflow-hidden mb-10 shadow-lg h-[300px] md:h-[500px] w-full">
                    <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="prose prose-lg max-w-none text-slate-600">
                    <div dangerouslySetInnerHTML={{ __html: blog.long_description }} />
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-10">
                {/* Search */}
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Search</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Type to search..."
                            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-50 pb-4">Recent Posts</h3>
                    <div className="space-y-6">
                        {recentBlogs.map((post) => (
                            <Link key={post.id} href={`/blog/${post.id}`} className="group flex gap-4 items-center">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {post.blog_date}
                                    </span>
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
