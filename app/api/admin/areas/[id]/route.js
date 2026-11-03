import { dbConnect } from "@/lib/db";
import Area from "@/models/Area";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";
import { clean } from "@/lib/validate";

export const PATCH = handle(async (req, { params }) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const { id } = await params;
  const b = await req.json();
  const set = {};
  if (b.name !== undefined) set.name = clean(b.name, 80);
  if (b.eta !== undefined) set.eta = Number(b.eta) || 45;
  if (b.fee !== undefined) set.fee = Math.max(0, Number(b.fee) || 0);
  if (b.active !== undefined) set.active = !!b.active;
  await dbConnect();
  const a = await Area.findByIdAndUpdate(id, set, { new: true }).lean();
  if (!a) return fail("Area not found.", 404);
  return ok({ id: a._id.toString(), name: a.name, city: a.city, eta: a.eta, fee: a.fee, active: a.active });
});

export const DELETE = handle(async (_req, { params }) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const { id } = await params;
  await dbConnect();
  await Area.findByIdAndDelete(id);
  return ok({ ok: true });
});
