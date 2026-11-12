// Menu helpers shared by the browser and the server, plus buildCatalog(), which turns the stored
// items and deals (MongoDB, managed from /admin/menu and /admin/deals) into what the pages use.
import { CATEGORIES, FBT, IF_UNAVAILABLE, SEED_ITEMS } from "@/data/menu";
import { DEAL_GROUPS as RAW_GROUPS, SEED_DEALS } from "@/data/deals";
import IMAGE_VERSIONS from "@/data/image-versions.json";

export { CATEGORIES, IF_UNAVAILABLE };
export const DEAL_GROUP_META = RAW_GROUPS;

// Meal upgrades for burgers, wraps and sandwiches.
export const FRIES_PRICE = 220;
export const DRINK_PRICE = 100;

export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// Adds the photo's content hash (scripts/image-versions.mjs) to local photo URLs, so a photo replaced under the
// same file name shows up straight away instead of an old cached copy. Uploaded photos already have unique URLs.
export const fresh = (src) => (src && IMAGE_VERSIONS[src] ? `${src}?v=${IMAGE_VERSIONS[src]}` : src);

// Every choice an item offers becomes a "size" (name -> price), so the cart, checkout and server
// all price variations the same way.
function variationsOf(it) {
  if (it.sizes?.length) return { sizes: Object.fromEntries(it.sizes.map((s) => [s.name, s.price])), variationLabel: "Choose a size" };
  if (it.meal)
    return {
      sizes: { "On its own": it.p, "With regular fries": it.p + FRIES_PRICE, "With fries & regular drink": it.p + FRIES_PRICE + DRINK_PRICE },
      variationLabel: "Make it a meal",
    };
  if (it.flavours?.length) return { sizes: Object.fromEntries(it.flavours.map((f) => [f, it.p])), variationLabel: "Choose a flavour" };
  return { sizes: null };
}

export const priceOf = (item, size) => (item.sizes ? item.sizes[size] ?? Object.values(item.sizes)[0] : item.p);
export const defaultSize = (item) => (item.sizes ? Object.keys(item.sizes)[0] : null);
// Lowest price an item can be ordered at ("from Rs. …" on the menu card).
export const fromPrice = (item) => (item.sizes ? Math.min(...Object.values(item.sizes)) : item.p);
export const imgSrc = (item) => item.img || item.art?.[0] || null;
export const formatPKR = (n) => "Rs. " + Number(n || 0).toLocaleString("en-PK");

const bySort = (a, b) => (a.sort ?? 0) - (b.sort ?? 0) || a.n.localeCompare(b.n);

/**
 * raw = { items: [stored item], deals: [stored deal] } (plain objects).
 * Hidden items and deals (active: false) are left out of the shop, so they can't be ordered either.
 */
export function buildCatalog(raw) {
  const catMeta = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
  const all = [...(raw?.items || [])].sort(bySort).map((it) => {
    const c = catMeta[it.category] || { id: it.category, name: it.category, glyph: "plus" };
    return {
      ...it,
      ...variationsOf(it),
      id: it.key,
      category: c.id,
      categoryName: c.name,
      glyph: c.glyph,
      img: fresh(it.img),
    };
  });
  const allById = Object.fromEntries(all.map((i) => [i.id, i]));
  const ITEMS = all.filter((i) => i.active !== false);
  const MENU = CATEGORIES.map((c) => ({ ...c, items: ITEMS.filter((i) => i.category === c.id) })).filter((c) => c.items.length);

  // Deals list their contents and the menu total they save on.
  const DEALS = [...(raw?.deals || [])]
    .filter((d) => d.active !== false)
    .sort(bySort)
    .map((d) => {
      const parts = (d.parts || []).map((x) => ({ item: allById[x.item], qty: x.qty || 1, size: x.size || null })).filter((x) => x.item);
      const was = parts.reduce((s, x) => s + priceOf(x.item, x.size) * x.qty, 0);
      return {
        ...d,
        id: d.key,
        sizes: null,
        img: fresh(d.img),
        category: "deals",
        categoryName: "Deals",
        glyph: "tag",
        d: parts.map((x) => `${x.qty > 1 ? `${x.qty} × ` : ""}${x.item.n}${x.size ? ` (${x.size})` : ""}`).join(", "),
        was: was > d.p ? was : null,
        // cut-out photos of what's inside, used until the deal has its own photo
        art: parts.map((x) => x.item.img).filter(Boolean),
      };
    });

  const DEAL_GROUPS = RAW_GROUPS.map((g) => ({
    ...g,
    banner: g.banner ? { ...g.banner, img: fresh(g.banner.img), artImgs: g.banner.art.map((id) => allById[id]?.img).filter(Boolean) } : null,
  }));

  const ITEM_BY_ID = { ...Object.fromEntries(ITEMS.map((i) => [i.id, i])), ...Object.fromEntries(DEALS.map((d) => [d.id, d])) };
  const POPULAR = ITEMS.filter((i) => i.popular);

  // "Frequently bought together" suggestions for an item's category.
  const frequentlyBoughtWith = (item) => (FBT[item.category] || []).filter((id) => id !== item.id && ITEM_BY_ID[id]).map((id) => ITEM_BY_ID[id]);

  return { MENU, ITEMS, DEALS, DEAL_GROUPS, ITEM_BY_ID, POPULAR, frequentlyBoughtWith };
}

// The starting menu, used before the database is filled and if it can't be reached.
export const SEED_RAW = { items: SEED_ITEMS, deals: SEED_DEALS };
