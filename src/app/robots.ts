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
      "https://www.upleex.com/sitemap.xml",
      "https://www.upleex.com/blog/sitemap.xml",
      "https://www.upleex.com/categories/sitemap.xml",
      "https://www.upleex.com/rent/sitemap.xml",
    ],
    host: "https://www.upleex.com",
  };
}