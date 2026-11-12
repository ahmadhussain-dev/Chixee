import "server-only";
import { revalidateTag, unstable_cache } from "next/cache";
import { dbConnect } from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import Deal from "@/models/Deal";
import Setting from "@/models/Setting";
import { SEED_RAW, buildCatalog } from "@/lib/menu";
import { log } from "@/lib/log";

export const CATALOG_TAG = "catalog";

const plain = ({ _id, __v, createdAt, updatedAt, ...rest }) => rest;
const plainSizes = (it) => ({ ...plain(it), sizes: (it.sizes || []).map(({ name, price }) => ({ name, price })) });
const plainDeal = (d) => ({ ...plain(d), parts: (d.parts || []).map(({ item, qty, size }) => ({ item, qty, size })) });

// First run: copy the starting menu (data/menu.js, data/deals.js) into MongoDB, once.
// Upserts by key, so two servers doing this at the same moment can't create duplicates.
export async function seedCatalogOnce() {
  const s = await Setting.findOne({ key: "store" }).select("catalogSeeded").lean();
  if (s?.catalogSeeded) return false;
  const upserts = (list) => list.map((doc) => ({ updateOne: { filter: { key: doc.key }, update: { $setOnInsert: doc }, upsert: true } }));
  const items = await MenuItem.bulkWrite(upserts(SEED_RAW.items));
  const deals = await Deal.bulkWrite(upserts(SEED_RAW.deals));
  await Setting.updateOne({ key: "store" }, { $set: { catalogSeeded: true } }, { upsert: true });
  if (items.upsertedCount || deals.upsertedCount) log.info("catalog.seeded", { items: items.upsertedCount, deals: deals.upsertedCount });
  return true;
}

// Everything stored, hidden items included (the admin panel needs those).
export async function loadCatalogRaw() {
  await dbConnect();
  await seedCatalogOnce();
  const [items, deals] = await Promise.all([MenuItem.find().lean(), Deal.find().lean()]);
  return { items: items.map(plainSizes), deals: deals.map(plainDeal) };
}

// Cached for the shop: refreshed straight away when the admin saves (refreshCatalog), and every 10 minutes as a safety net.
const cachedRaw = unstable_cache(loadCatalogRaw, ["catalog-raw-v1"], { tags: [CATALOG_TAG], revalidate: 600 });

// Raw catalog for the browser (CatalogProvider builds the rest). Falls back to the starting menu if the database is down,
// so the menu still shows; orders are still checked against the database.
export async function getCatalogRaw() {
  try {
    return await cachedRaw();
  } catch (e) {
    log.error("catalog.load_failed", { error: e.message });
    return SEED_RAW;
  }
}

export async function getCatalog() {
  return buildCatalog(await getCatalogRaw());
}

// Uncached, for pricing orders: never trust a stale or fallback price.
export async function getCatalogForOrder() {
  return buildCatalog(await loadCatalogRaw());
}

export function refreshCatalog() {
  revalidateTag(CATALOG_TAG, { expire: 0 });
}
