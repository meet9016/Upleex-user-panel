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

  try {
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3688/api/v1/';
    const res = await fetch(`${apiUrl}sitemap/dynamic-urls`, { next: { revalidate: 3600 } });
    const json = await res.json();
    
    if (json.success && json.data) {
      const dynamicUrls = json.data.map((item: any) => ({
        url: item.url.replace(/^http:\/\/localhost:\d+/, baseUrl),
        lastModified: item.lastModified,
        priority: item.priority
      }));
      return [...staticUrls, ...dynamicUrls];
    }
  } catch (e) {
    console.error("Failed to fetch dynamic sitemap", e);
  }

  return staticUrls;
}