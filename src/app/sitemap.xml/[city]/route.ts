
import { NextResponse } from 'next/server';
import { createSlug } from '@/utils/helper';

export async function GET(request: Request, { params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const baseUrl = "https://www.upleex.com";
  const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

  const reqUrl = new URL(request.url);
  if (reqUrl.pathname.startsWith('/sitemap.xml/')) {
    // Return empty sitemap for .xml paths as requested instead of 404
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  }

  try {
    // Fetch categories and subcategories
    const catRes = await fetch(`${API_BASE}categories/getall`, { next: { revalidate: 3600 } });
    const catJson = await catRes.json();
    const categories = catJson?.data || [];

    const prodRes = await fetch(`${API_BASE}products/getall?limit=10000`, { next: { revalidate: 3600 } });
    const prodJson = await prodRes.json();
    const allProducts = prodJson?.data || [];

    // Fetch all services to filter by this city
    const serviceRes = await fetch(`${API_BASE}services/getall?limit=10000`, { next: { revalidate: 3600 } });
    const serviceJson = await serviceRes.json();
    const allServices = serviceJson?.data || [];

    // Filter products for this city
    const cityProducts = allProducts.filter((p: any) => {
      const cityName = p.vendor?.vendor_city_name || p.vendor_city_name;
      return cityName && createSlug(cityName) === city;
    });

    // Filter services for this city
    const cityServices = allServices.filter((s: any) => {
      const cityName = s.vendor?.vendor_city_name || s.vendor_city_name;
      return cityName && createSlug(cityName) === city;
    });

    // Validate if city exists
    let isValidCity = true; // Default to true in case API fails
    try {
      const searchStr = city.replace(/-/g, ' ');
      const cityCheckRes = await fetch(`${API_BASE}vendor-india-city-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: 1, limit: 20, search: searchStr })
      });
      if (cityCheckRes.ok) {
        const cityCheckJson = await cityCheckRes.json();
        const foundCities = cityCheckJson?.data?.data || [];
        isValidCity = foundCities.some((c: any) => createSlug(c.city_name || '') === city);
      }
    } catch (err) {
      console.warn("Could not validate city against API", err);
    }

    if (!isValidCity) {
      // If city is definitively invalid, return empty sitemap
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
      return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
    }

    // Find which categories/subcategories actually have products in this city
    const activeCategories = new Set<string>();
    const activeSubcategories = new Set<string>();

    cityProducts.forEach((p: any) => {
      const catSlug = p.category_slug || createSlug(p.category_name || 'category');
      const subCatSlug = p.sub_category_slug || createSlug(p.sub_category_name || 'subcategory');
      activeCategories.add(catSlug);
      activeSubcategories.add(`${catSlug}/${subCatSlug}`);
    });

    // Find which service categories actually have services in this city
    const activeServiceCategories = new Set<string>();

    cityServices.forEach((s: any) => {
      const catSlug = createSlug(s.category_name || 'category');
      if (catSlug) {
        activeServiceCategories.add(catSlug);
      }
    });

    let urls: string[] = [];

    categories.forEach((cat: any) => {
      const categorySlug = createSlug(cat.slug || cat.categories_name || 'category');

      urls.push(`
  <url>
    <loc>${baseUrl}/rent/${city}/${categorySlug}</loc>
    <lastmod>${new Date(cat.updated_at || new Date()).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

      if (cat.subcategories && Array.isArray(cat.subcategories)) {
        cat.subcategories.forEach((sub: any) => {
          const subSlug = createSlug(sub.slug || sub.subcategory_name || 'subcategory');

          urls.push(`
  <url>
    <loc>${baseUrl}/rent/${city}/${categorySlug}/${subSlug}</loc>
    <lastmod>${new Date(sub.updated_at || cat.updated_at || new Date()).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`);
        });
      }
    });

    cityProducts.forEach((product: any) => {
      const productSlug = product.slug || createSlug(product.product_name || 'product');
      const subCatSlug = product.sub_category_slug || createSlug(product.sub_category_name || 'subcategory');

      urls.push(`
  <url>
    <loc>${baseUrl}/${subCatSlug}/${productSlug}</loc>
    <lastmod>${new Date(product.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
    });

    activeServiceCategories.forEach((catSlug: string) => {
      urls.push(`
  <url>
    <loc>${baseUrl}/services-list/${city}/${catSlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);

      urls.push(`
  <url>
    <loc>${baseUrl}/${catSlug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`);
    });

    cityServices.forEach((service: any) => {
      const serviceSlug = service.slug || createSlug(service.service_name || 'service');

      urls.push(`
  <url>
    <loc>${baseUrl}/service/${city}/${serviceSlug}</loc>
    <lastmod>${new Date(service.updatedAt || new Date()).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error("Error generating city sitemap", error);
    // Return empty sitemap on error so Google doesn't penalize
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;
    return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
  }
}