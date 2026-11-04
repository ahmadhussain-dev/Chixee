// Writes data/image-versions.json: a short content hash for every photo the menu and deals use.
// data/menu.js adds it to the image URL (…/half-broast.webp?v=1a2b3c4d), so when a photo is
// replaced under the same name, phones, tablets and the image CDN fetch the new one instead of a cached copy.
// Runs automatically before `npm run dev` and `npm run build`.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath (not URL.pathname) so Windows paths come out as D:\... instead of /D:/...
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIRS = ["images/menu-cut", "images/dealmenu"];
const out = {};
for (const dir of DIRS) {
  const abs = path.join(root, "public", dir);
  if (!existsSync(abs)) continue;
  for (const f of readdirSync(abs).sort()) {
    if (!/\.(webp|png|jpe?g|avif)$/i.test(f)) continue;
    out[`/${dir}/${f}`] = createHash("sha1").update(readFileSync(path.join(abs, f))).digest("hex").slice(0, 8);
  }
}
writeFileSync(path.join(root, "data/image-versions.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`image-versions: ${Object.keys(out).length} images`);
