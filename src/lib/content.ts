const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

// Helper to create readable slugs
function createSlug(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

export async function getBlogPosts() {
  try {
    const res = await fetch(`${API_BASE}blogs/getall`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    if (json?.data && Array.isArray(json.data)) {
      return json.data.map((blog: any) => {
        let blogDate = new Date();
        if (blog.blog_date) {
          const parts = blog.blog_date.split('-');
          if (parts.length === 3) {
            blogDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        return {
          slug: blog.slug || createSlug(blog.title || 'blog'),
          updatedAt: isNaN(blogDate.getTime()) ? new Date() : blogDate,
        };
      });
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}categories/getall`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    if (json?.data && Array.isArray(json.data)) {
      return json.data.map((cat: any) => ({
        slug: cat.slug || createSlug(cat.categories_name || 'category'),
        updatedAt: new Date(cat.updated_at || new Date()),
      }));
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}

export async function getRentFilters() {
  try {
    const res = await fetch(`${API_BASE}products/getall?limit=10000`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    
    if (json?.data && Array.isArray(json.data)) {
      const uniqueFilters = new Map<string, any>();
      
      json.data.forEach((product: any) => {
        const city = createSlug(product.vendor_city_name || 'surat');
        const category = createSlug(product.category_name || 'category');
        const subCategory = createSlug(product.sub_category_name || 'subcategory');
        
        // Path format matching PDF: city/category/subcategory
        const path = `${city}/${category}/${subCategory}`;
        
        if (!uniqueFilters.has(path)) {
          uniqueFilters.set(path, {
            path,
            updatedAt: new Date(product.updatedAt || new Date())
          });
        }
      });
      
      return Array.from(uniqueFilters.values());
    }
  } catch (error) {
    console.error(error);
  }
  return [];
}
