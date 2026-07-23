import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.upleex.com/", priority: 1.0 },
    { url: "https://www.upleex.com/about-us", priority: 0.4 },
    { url: "https://www.upleex.com/partner", priority: 0.4 },
  ];
}