import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.upleex.com/", priority: 1.0 },
    { url: "https://www.upleex.com/about-us", priority: 0.4 },
    { url: "https://www.upleex.com/faq", priority: 0.4 },
    { url: "https://www.upleex.com/contact-us", priority: 0.4 },
    { url: "https://www.upleex.com/terms-of-use", priority: 0.3 },
    { url: "https://www.upleex.com/privacy-policy", priority: 0.3 },
    { url: "https://www.upleex.com/refund-policy", priority: 0.3 },
    { url: "https://www.upleex.com/partner", priority: 0.4 },
    { url: "https://www.upleex.com/categories", priority: 0.5 },
    { url: "https://www.upleex.com/blog", priority: 0.5 },
  ];
}