import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PUBLIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency: path === "/booking" ? "daily" : "monthly",
    priority: path === "/" ? 1 : path === "/booking" || path === "/pricing" ? 0.9 : 0.7,
  }));
}
