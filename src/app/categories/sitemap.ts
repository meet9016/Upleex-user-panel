import { MetadataRoute } from "next";
import { getCategories } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = await getCategories();
  return categories.map((cat: any) => ({
    url: `https://www.upleex.com/categories/${cat.slug}`,
    lastModified: cat.updatedAt,
  }));
}
