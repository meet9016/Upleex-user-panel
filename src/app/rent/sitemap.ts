import { MetadataRoute } from "next";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

function createSlug(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemap: MetadataRoute.Sitemap = [];

  try {
    const prodRes = await fetch(`${API_BASE}products/getall?limit=10000`, { cache: "no-store" });
    if (prodRes.ok) {
      const products = await prodRes.json();
      if (products?.data && Array.isArray(products.data)) {
        
        // Use a Set to store unique combinations of city/cat/subcat
        const uniquePages = new Set<string>();

        products.data.forEach((product: any) => {
          const city = createSlug(product.vendor_city_name || 'surat');
          const category = createSlug(product.category_name || 'category');
          const subCategory = createSlug(product.sub_category_name || 'subcategory');
          
          const path = `rent/${city}/${category}/${subCategory}`;
          
          if (!uniquePages.has(path)) {
            uniquePages.add(path);
            sitemap.push({
              url: `https://upleex.com/${path}`,
              lastModified: new Date(product.updatedAt || new Date()),
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error fetching products for sitemap", error);
  }

  return sitemap;
}
