import React, { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Blog } from "@/services/blogService";

interface LatestBlogsProps {
  blogs: Blog[];
}

export const LatestBlogs = ({ blogs }: LatestBlogsProps) => {
  const latestBlogs = useMemo(() => blogs.slice(0, 4), [blogs]);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="relative mb-12 flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary text-center pb-1">
            Latest Blogs
          </h2>

          <div className="absolute right-0 hidden md:block">
            <Link href="/blog">
              <Button
                variant="outline"
                className="rounded-full px-6"
                aria-label="View all blogs"
              >
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  );
};

interface BlogCardProps {
  blog: Blog;
}

const BlogCard = memo(({ blog }: BlogCardProps) => {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group block cursor-pointer"
      aria-label={`Read blog: ${blog.title}`}
    >
      <article className="h-full">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-2xl mb-4 shadow-lg">
          <div className="aspect-square bg-gray-100 relative">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
            <p className="text-white font-semibold text-sm line-clamp-2">
              {blog.title}
            </p>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 transition-all line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-[#6366f1] group-hover:to-[#0ea5e9] group-hover:bg-clip-text group-hover:text-transparent">
          {blog.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
          {blog.description}
        </p>
      </article>
    </Link>
  );
});

BlogCard.displayName = "BlogCard";
