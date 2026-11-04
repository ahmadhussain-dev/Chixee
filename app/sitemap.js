import { SITE } from "@/data/site";

export default function sitemap() {
  const now = new Date();
  return ["", "/deals", "/about", "/contact", "/track", "/login", "/signup"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/deals" ? 0.9 : 0.5,
  }));
}
