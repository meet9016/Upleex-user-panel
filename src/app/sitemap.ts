import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://upleex.com/", priority: 1.0 },
    { url: "https://upleex.com/about-us", priority: 0.4 },
    { url: "https://upleex.com/faq", priority: 0.4 },
    { url: "https://upleex.com/contact-us", priority: 0.4 },
    { url: "https://upleex.com/terms-of-use", priority: 0.4 },
    { url: "https://upleex.com/privacy-policy", priority: 0.4 },
    { url: "https://upleex.com/refund-policy", priority: 0.4 },
    { url: "https://upleex.com/partner", priority: 0.4 },
    { url: "https://upleex.com/categories", priority: 0.8 },
  ];
}