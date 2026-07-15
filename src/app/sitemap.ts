import { MetadataRoute } from "next";

const BASE_URL = "https://upleex.com";
const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

// Helper to create slugs safely
function createSlug(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  // Static Pages
  sitemap.push(
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/about-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/refund-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/terms-of-use`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/services-list`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 }
  );

  // Categories
  try {
    const catRes = await fetch(`${API_BASE}categories/getall`, { cache: "no-store" });
    if (catRes.ok) {
      const categories = await catRes.json();
      if (categories?.data && Array.isArray(categories.data)) {
        categories.data.forEach((category: any) => {
          const slug = category.slug || createSlug(category.categories_name || 'category');
          sitemap.push({
            url: `${BASE_URL}/rent/surat/${slug}`,
            lastModified: new Date(category.updated_at || new Date()),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap", error);
  }

  // Products
  try {
    const prodRes = await fetch(`${API_BASE}products/getall?limit=10000`, { cache: "no-store" });
    if (prodRes.ok) {
      const products = await prodRes.json();
      if (products?.data && Array.isArray(products.data)) {
        products.data.forEach((product: any) => {
          const subCatSlug = product.sub_category_slug || createSlug(product.sub_category_name || 'subcategory');
          const productSlug = product.slug || createSlug(product.product_name || 'product');
          sitemap.push({
            url: `${BASE_URL}/${subCatSlug}/${productSlug}`,
            lastModified: new Date(product.updatedAt || new Date()),
            changeFrequency: "daily",
            priority: 0.9,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap", error);
  }

  // Blogs
  try {
    const blogRes = await fetch(`${API_BASE}blogs/getall`, { cache: "no-store" });
    if (blogRes.ok) {
      const blogs = await blogRes.json();
      if (blogs?.data && Array.isArray(blogs.data)) {
        blogs.data.forEach((blog: any) => {
          const slug = blog.slug || createSlug(blog.title || 'blog');
          let blogDate = new Date();
          if (blog.blog_date) {
            // Check if format is DD-MM-YYYY
            const parts = blog.blog_date.split('-');
            if (parts.length === 3) {
              blogDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
          }
          sitemap.push({
            url: `${BASE_URL}/blog/${slug}`,
            lastModified: isNaN(blogDate.getTime()) ? new Date() : blogDate,
            changeFrequency: "weekly",
            priority: 0.7,
          });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap", error);
  }

  return sitemap;
}