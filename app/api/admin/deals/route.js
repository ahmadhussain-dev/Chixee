import { dbConnect } from "@/lib/db";
import Deal from "@/models/Deal";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle, readJson } from "@/lib/api";
import { refreshCatalog } from "@/lib/catalog";
import { itemsByKey, parseDeal, uniqueKey } from "@/lib/menu-admin";
import { log } from "@/lib/log";

export const dynamic = "force-dynamic";

// Add a new deal.
export const POST = handle(async (req) => {
  const admin = await requireAdmin();
  if (!admin) return fail("Admins only.", 403);
  const b = await readJson(req);
  await dbConnect();
  const { doc, error } = parseDeal(b, await itemsByKey());
  if (error) return fail(error, 422);
  const last = await Deal.findOne().sort({ sort: -1 }).select("sort").lean();
  const deal = await Deal.create({ ...doc, key: await uniqueKey(Deal, `deals-${doc.n}`), sort: doc.sort ?? (last?.sort ?? -1) + 1 });
  refreshCatalog();
  log.info("menu.deal_created", { key: deal.key, by: admin.user.email });
  return ok(deal.toObject(), { status: 201 });
});
