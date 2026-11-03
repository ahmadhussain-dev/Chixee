import { SITE } from "@/data/site";

export default function sitemap() {
  const now = new Date();
  return ["", "/about", "/contact", "/track", "/login", "/signup"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.5,
  }));
}
