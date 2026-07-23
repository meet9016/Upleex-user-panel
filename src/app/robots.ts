import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/profile",
          "/cart",
          "/wishlist",
          "/search",
          "/membership",
          "/login",
          "/register",
          "/dashboard",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: [
      "https://upleex.com/sitemap.xml",
      "https://upleex.com/blog/sitemap.xml",
      "https://upleex.com/categories/sitemap.xml",
      "https://upleex.com/rent/sitemap.xml",
    ],
    host: "https://upleex.com",
  };
}