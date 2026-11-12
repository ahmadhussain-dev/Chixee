import { dbConnect } from "@/lib/db";
import MenuItem from "@/models/MenuItem";
import Deal from "@/models/Deal";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle, readJson } from "@/lib/api";
import { refreshCatalog } from "@/lib/catalog";
import { parseItem } from "@/lib/menu-admin";
import { log } from "@/lib/log";

// Edit an item. Send the whole item, or just { active } to show/hide it.
export const PATCH = handle(async (req, { params }) => {
  const admin = await requireAdmin();
  if (!admin) return fail("Admins only.", 403);
  const { key } = await params;
  const b = await readJson(req);
  await dbConnect();
  const item = await MenuItem.findOne({ key });
  if (!item) return fail("Item not found.", 404);
  if (Object.keys(b).length === 1 && typeof b.active === "boolean") {
    item.active = b.active;
  } else {
    const { doc, error } = parseItem({ ...item.toObject(), ...b });
    if (error) return fail(error, 422);
    item.set(doc);
  }
  await item.save();
  refreshCatalog();
  log.info("menu.item_updated", { key, by: admin.user.email });
  return ok(item.toObject());
});

// Delete an item. Refused while a deal still includes it.
export const DELETE = handle(async (_req, { params }) => {
  const admin = await requireAdmin();
  if (!admin) return fail("Admins only.", 403);
  const { key } = await params;
  await dbConnect();
  const inDeals = await Deal.find({ "parts.item": key }).select("n").lean();
  if (inDeals.length)
    return fail(`It's part of ${inDeals.map((d) => d.n).join(", ")}. Take it out of those deals first, or hide it instead.`, 409);
  const gone = await MenuItem.findOneAndDelete({ key });
  if (!gone) return fail("Item not found.", 404);
  refreshCatalog();
  log.info("menu.item_deleted", { key, by: admin.user.email });
  return ok({ ok: true });
});
