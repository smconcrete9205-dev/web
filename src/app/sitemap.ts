import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllProducts } from "@/lib/products";

// Products are admin-editable in the database — generate the sitemap fresh
// on every request instead of caching it from build-time data.
export const dynamic = "force-dynamic";

/**
 * Native Next.js sitemap (replaces next-sitemap). Product pages are stored in
 * the database and editable via /admin/products, so the sitemap is generated
 * from live data at request time rather than crawled from static build
 * output — a static-file-based sitemap generator would miss any product
 * added or renamed after the last build.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
