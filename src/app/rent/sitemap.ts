import { MetadataRoute } from "next";
import { getRentFilters } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const filters = await getRentFilters();
  return filters.map((filter: any) => ({
    url: `https://www.upleex.com/rent/${filter.path}`,
    lastModified: filter.updatedAt,
  }));
}
