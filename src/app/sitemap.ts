
import { MetadataRoute } from 'next';
import axios from 'axios';
import endPointApi from '@/utils/endPointApi';

export const revalidate = 0;
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
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://upleex.digitalks.co.in/api/v1';
    // Fetch first page to get total pages
    const firstRes = await axios.post(`${apiUrl}/${endPointApi.webAllCityList}`, { page: 1, limit: 100 });

    if (firstRes.status === 200) {
      const firstData = firstRes.data;
      const totalPages = firstData?.data?.totalPages || 1;
      let allCities = firstData?.data?.data || [];

      // Fetch remaining pages in parallel
      if (totalPages > 1) {
        const promises = [];
        for (let i = 2; i <= totalPages; i++) {
          promises.push(
            axios.post(`${apiUrl}/${endPointApi.webAllCityList}`, { page: i, limit: 100 })
              .then(res => res.data)
              .catch(() => null)
          );
        }
        const results = await Promise.all(promises);
        results.forEach(data => {
          if (data?.data?.data) {
            allCities = allCities.concat(data.data.data);
          }
        });
      }

      if (Array.isArray(allCities)) {
        dynamicUrls = allCities.map((city: any) => {
          const slug = (city.city_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
          return {
            url: `${baseUrl}/sitemap/${slug}`,
            priority: 0.6,
          };
        }).filter((item) => item.url !== `${baseUrl}/sitemap/`);
      }
    }
  } catch (error: any) {
    console.error("Error fetching cities for sitemap:", error);
  }

  const allUrls = [...staticUrls, ...dynamicUrls];
  const uniqueUrls = allUrls.filter((v, i, a) => a.findIndex(t => (t.url === v.url)) === i);

  return uniqueUrls;
}