'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogService, Blog } from '@/services/blogService';
import { Button } from '@/components/ui/Button';
import { BackButton } from '@/components/ui/BackButton';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getBlogList();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-40 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-72 bg-gray-100 rounded-2xl animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-10 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <BackButton />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Blogs
            </h1>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-6 hidden md:inline-flex"
          >
            {blogs.length} Articles
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block cursor-pointer"
            >
              <article className="h-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-100">
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5 flex flex-col h-[180px]">
                  <h2 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-upleex-purple transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                    <span>{blog.blog_date}</span>
                    <span className="font-semibold text-upleex-purple">
                      Read More
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
