import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  const staticne = ["", "/recepti", "/trending", "/o-meni", "/privatnost"].map((path) => ({
    url: `${SITE.url}${path}`,
  }));
  const recepti = posts.map((p) => ({
    url: `${SITE.url}/recepti/${p.slug}`,
    lastModified: p.created_at,
  }));
  return [...staticne, ...recepti];
}
