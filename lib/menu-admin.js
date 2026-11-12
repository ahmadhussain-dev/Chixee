import "server-only";
import { CATEGORIES, DEAL_GROUP_META, slug } from "@/lib/menu";
import { clean } from "@/lib/validate";
import MenuItem from "@/models/MenuItem";

// Checks what the admin panel sends for an item or a deal. Returns { error } or { doc }.

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));
const GROUP_IDS = new Set(DEAL_GROUP_META.map((g) => g.id));

const money = (v) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 && n <= 100000 ? Math.round(n) : null;
};

// Photos in the site (/images/...) or uploaded from the admin panel (Vercel Blob). Other websites' links aren't
// accepted, because Next.js only resizes pictures from hosts listed in next.config.mjs.
const BLOB_URL = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s]+$/i;
function photo(v) {
  const s = clean(v, 500).replace(/\?v=[a-f0-9]+$/, ""); // drop the cache-busting hash the shop adds to local photos
  if (!s) return "";
  if ((s.startsWith("/images/") && !s.includes("..")) || BLOB_URL.test(s)) return s;
  return null;
}

export function parseItem(b) {
  const category = clean(b.category, 30);
  if (!CATEGORY_IDS.has(category)) return { error: "Choose a category." };
  const n = clean(b.n, 80);
  if (n.length < 2) return { error: "Enter the item name." };
  const img = photo(b.img);
  if (img === null) return { error: "Please upload the photo again." };

  const sizes = [];
  for (const row of Array.isArray(b.sizes) ? b.sizes.slice(0, 10) : []) {
    const name = clean(row?.name, 30);
    if (!name && (row?.price === "" || row?.price == null)) continue; // empty row
    const price = money(row?.price);
    if (!name || price === null || price === 0) return { error: "Every size needs a name and a price." };
    if (sizes.some((s) => s.name.toLowerCase() === name.toLowerCase())) return { error: `The size "${name}" is listed twice.` };
    sizes.push({ name, price });
  }
  const p = sizes.length ? null : money(b.p);
  if (!sizes.length && !p) return { error: "Enter a price, or add sizes with their prices." };

  const flavours = sizes.length
    ? []
    : [...new Set((Array.isArray(b.flavours) ? b.flavours : String(b.flavours || "").split(",")).map((f) => clean(f, 30)).filter(Boolean))].slice(0, 12);

  return {
    doc: {
      category,
      n,
      d: clean(b.d, 200),
      p,
      sizes,
      meal: !sizes.length && !flavours.length && !!b.meal,
      flavours,
      tag: clean(b.tag, 20),
      popular: !!b.popular,
      img,
      active: b.active !== false,
      ...(b.sort !== undefined && Number.isFinite(Number(b.sort)) ? { sort: Number(b.sort) } : {}),
    },
  };
}

// `itemsByKey`: stored menu items, to check the deal's contents exist and the chosen sizes are real.
export function parseDeal(b, itemsByKey) {
  const group = clean(b.group, 20);
  if (!GROUP_IDS.has(group)) return { error: "Choose which deals section it goes in." };
  const n = clean(b.n, 80);
  if (n.length < 2) return { error: "Enter the deal name." };
  const p = money(b.p);
  if (!p) return { error: "Enter the deal price." };
  const img = photo(b.img);
  if (img === null) return { error: "Please upload the photo again." };

  const parts = [];
  for (const row of Array.isArray(b.parts) ? b.parts.slice(0, 12) : []) {
    const item = itemsByKey[row?.item];
    if (!item) continue;
    const qty = Math.min(20, Math.max(1, parseInt(row.qty, 10) || 1));
    let size = clean(row.size, 30);
    if (item.sizes?.length) {
      if (!item.sizes.some((s) => s.name === size)) size = item.sizes[0].name;
    } else size = "";
    parts.push({ item: item.key, qty, size });
  }
  if (!parts.length) return { error: "Add at least one menu item to the deal." };

  return {
    doc: {
      group,
      n,
      p,
      serves: Math.min(50, Math.max(1, parseInt(b.serves, 10) || 1)),
      when: clean(b.when, 40),
      badge: clean(b.badge, 24),
      featured: !!b.featured,
      img,
      parts,
      active: b.active !== false,
      ...(b.sort !== undefined && Number.isFinite(Number(b.sort)) ? { sort: Number(b.sort) } : {}),
    },
  };
}

// A new, unused key like "burgers-zinger-burger" (or "-2", "-3" if taken).
export async function uniqueKey(Model, base) {
  const root = slug(base) || "item";
  for (let i = 1; i < 100; i++) {
    const key = i === 1 ? root : `${root}-${i}`;
    if (!(await Model.exists({ key }))) return key;
  }
  return `${root}-${Date.now()}`;
}

// Stored menu items by key (for checking a deal's contents).
export const itemsByKey = async () => Object.fromEntries((await MenuItem.find().lean()).map((i) => [i.key, i]));
