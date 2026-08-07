import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.upleex.com";
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, priority: 1.0 },
    { url: `${baseUrl}/about-us`, priority: 0.4 },
    { url: `${baseUrl}/faq`, priority: 0.4 },
    { url: `${baseUrl}/contact-us`, priority: 0.4 },
    { url: `${baseUrl}/terms-of-use`, priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, priority: 0.3 },
    { url: `${baseUrl}/partner`, priority: 0.4 },
    { url: `${baseUrl}/categories`, priority: 0.5 },
    { url: `${baseUrl}/blog`, priority: 0.5 },
  ];

  let dynamicUrls: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3689/api/v1';
    const response = await fetch(`${apiUrl}/vendor-india-city-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page: 1, limit: 10000 })
    });
    
    if (response.ok) {
      const result = await response.json();
      const cities = result?.data?.data || [];
      if (Array.isArray(cities)) {
        dynamicUrls = cities.map((city: any) => {
          const slug = (city.city_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          return {
            url: `${baseUrl}/sitemap.xml/${slug}`,
            priority: 0.6,
          };
        }).filter((item) => item.url !== `${baseUrl}/sitemap.xml/`); 
      }
    }
    
  } catch (error) {
    console.error("Error fetching cities for sitemap:", error);
  }

  const allUrls = [...staticUrls, ...dynamicUrls];
  const uniqueUrls = allUrls.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

  return uniqueUrls;
}