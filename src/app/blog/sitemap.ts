import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  return posts.map((post: any) => ({
    url: `https://www.upleex.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));
}
