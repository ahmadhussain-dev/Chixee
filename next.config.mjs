import path from "node:path";
import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Menu and deal photos carry a ?v=<content hash> (data/image-versions.json) so replaced photos aren't served from cache.
    // Leaving out `search` allows any query string on these paths.
    localPatterns: [{ pathname: "/images/**" }],
    // Photos uploaded from the admin panel (Vercel Blob).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // Pin the project root. If another package-lock.json sits in a parent folder (e.g. D:\Chixee),
  // Next.js would otherwise treat that folder as the root and watch every file in it, so changes
  // outside the site (synced or generated files) trigger endless Fast Refresh reloads in `npm run dev`.
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
};
export default nextConfig;
