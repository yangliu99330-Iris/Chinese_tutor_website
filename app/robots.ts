import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Private or transactional pages: admin, APIs, per-booking manage links,
        // payment confirmation and one-off card links.
        disallow: ["/admin", "/api/", "/manage/", "/booking/success", "/card/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
