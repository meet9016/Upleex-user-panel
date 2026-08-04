import { NextResponse } from 'next/server';
import { createSlug } from '@/utils/helper';

export async function GET() {
  const baseUrl = "https://www.upleex.com";
  const API_BASE = process.env.NEXT_PUBLIC_APP_URL || "https://upleex.digitalks.co.in/api/v1/";

  try {
    // Fetch active cities from products
    const res = await fetch(`${API_BASE}products/getall?limit=10000`, { next: { revalidate: 3600 } });
    const json = await res.json();
    
    const activeCities = new Set<string>();
    
    if (json?.data && Array.isArray(json.data)) {
      json.data.forEach((product: any) => {
        const cityName = product.vendor?.vendor_city_name || product.vendor_city_name;
        if (cityName) {
          activeCities.add(createSlug(cityName));
        }
      });
    }

    // Fetch services to include their cities too
    const serviceRes = await fetch(`${API_BASE}services/getall?limit=10000`, { next: { revalidate: 3600 } });
    const serviceJson = await serviceRes.json();

    if (serviceJson?.data && Array.isArray(serviceJson.data)) {
      serviceJson.data.forEach((service: any) => {
        const cityName = service.vendor?.vendor_city_name || service.vendor_city_name;
        if (cityName) {
          activeCities.add(createSlug(cityName));
        }
      });
    }

    const cityRes = await fetch(`${API_BASE}vendor-india-city-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page: 1, limit: 10000 })
    });
    
    const cityJson = await cityRes.json();
    const citiesData = cityJson?.data?.data || [];
    
    citiesData.forEach((c: any) => {
      if (c.city_name) {
        activeCities.add(createSlug(c.city_name));
      }
    });

    const cities = Array.from(activeCities);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${cities.map((city: string) => `
  <sitemap>
    <loc>${baseUrl}/sitemap.xml/${city}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join('')}
</sitemapindex>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error("Error generating city sitemap index", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
