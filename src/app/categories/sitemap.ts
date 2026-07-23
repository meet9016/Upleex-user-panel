import { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

function createSlug(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  try {
    const catRes = await fetch(`${API_BASE}categories/getall`, { cache: "no-store" });
    if (catRes.ok) {
      const categories = await catRes.json();
      if (categories?.data && Array.isArray(categories.data)) {
        categories.data.forEach((category: any) => {
          const slug = category.slug || createSlug(category.categories_name || 'category');
          sitemap.push({
            url: `https://upleex.com/categories/${slug}`,
            lastModified: new Date(category.updated_at || new Date()),
          });
        });
      }
    }
  } catch (error) {
    console.error("Error fetching categories for sitemap", error);
  }

  return sitemap;
}
