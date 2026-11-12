import { dbConnect } from "@/lib/db";
import Deal from "@/models/Deal";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle, readJson } from "@/lib/api";
import { refreshCatalog } from "@/lib/catalog";
import { itemsByKey, parseDeal } from "@/lib/menu-admin";
import { log } from "@/lib/log";

// Edit a deal. Send the whole deal, or just { active } to show/hide it.
export const PATCH = handle(async (req, { params }) => {
  const admin = await requireAdmin();
  if (!admin) return fail("Admins only.", 403);
  const { key } = await params;
  const b = await readJson(req);
  await dbConnect();
  const deal = await Deal.findOne({ key });
  if (!deal) return fail("Deal not found.", 404);
  if (Object.keys(b).length === 1 && typeof b.active === "boolean") {
    deal.active = b.active;
  } else {
    const { doc, error } = parseDeal({ ...deal.toObject(), ...b }, await itemsByKey());
    if (error) return fail(error, 422);
    deal.set(doc);
  }
  await deal.save();
  refreshCatalog();
  log.info("menu.deal_updated", { key, by: admin.user.email });
  return ok(deal.toObject());
});

export const DELETE = handle(async (_req, { params }) => {
  const admin = await requireAdmin();
  if (!admin) return fail("Admins only.", 403);
  const { key } = await params;
  await dbConnect();
  const gone = await Deal.findOneAndDelete({ key });
  if (!gone) return fail("Deal not found.", 404);
  refreshCatalog();
  log.info("menu.deal_deleted", { key, by: admin.user.email });
  return ok({ ok: true });
});
