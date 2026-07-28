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

  return staticUrls;
}