import { dbConnect } from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle, readJson } from "@/lib/api";
import { loadCatalogRaw, refreshCatalog } from "@/lib/catalog";
import { parseItem, uniqueKey } from "@/lib/menu-admin";
import { log } from "@/lib/log";

export const dynamic = "force-dynamic";

// Every item and deal, hidden ones included.
export const GET = handle(async () => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  return ok(await loadCatalogRaw());
});

// Add a new item.
export const POST = handle(async (req) => {
  const admin = await requireAdmin();
  if (!admin) return fail("Admins only.", 403);
  const { doc, error } = parseItem(await readJson(req));
  if (error) return fail(error, 422);
  await dbConnect();
  const last = await MenuItem.findOne({ category: doc.category }).sort({ sort: -1 }).select("sort").lean();
  const item = await MenuItem.create({ ...doc, key: await uniqueKey(MenuItem, `${doc.category}-${doc.n}`), sort: doc.sort ?? (last?.sort ?? -1) + 1 });
  refreshCatalog();
  log.info("menu.item_created", { key: item.key, by: admin.user.email });
  return ok(item.toObject(), { status: 201 });
});
