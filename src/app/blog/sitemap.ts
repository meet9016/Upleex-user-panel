import { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

function createSlug(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  try {
    const blogRes = await fetch(`${API_BASE}blogs/getall`, { cache: "no-store" });
    if (blogRes.ok) {
      const blogs = await blogRes.json();
      if (blogs?.data && Array.isArray(blogs.data)) {
        blogs.data.forEach((blog: any) => {
          const slug = blog.slug || createSlug(blog.title || 'blog');
          let blogDate = new Date();
          if (blog.blog_date) {
            const parts = blog.blog_date.split('-');
            if (parts.length === 3) {
              blogDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
          }
          sitemap.push({
            url: `https://upleex.com/blog/${slug}`,
            lastModified: isNaN(blogDate.getTime()) ? new Date() : blogDate,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap", error);
  }

  return sitemap;
}
