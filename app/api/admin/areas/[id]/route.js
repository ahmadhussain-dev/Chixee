import { dbConnect } from "@/lib/db";
import Area from "@/models/Area";
import { ok, fail, route, readJson } from "@/lib/api";
import { clean } from "@/lib/validate";

export const PATCH = route(async (req, { params }) => {
  const { id } = await params;
  const b = await readJson(req);
  const set = {};
  if (b.name !== undefined) set.name = clean(b.name, 80);
  if (b.eta !== undefined) set.eta = Number(b.eta) || 45;
  if (b.fee !== undefined) set.fee = Math.max(0, Number(b.fee) || 0);
  if (b.active !== undefined) set.active = !!b.active;
  await dbConnect();
  const a = await Area.findByIdAndUpdate(id, set, { new: true }).lean();
  if (!a) return fail("Area not found.", 404);
  return ok({ id: a._id.toString(), name: a.name, city: a.city, eta: a.eta, fee: a.fee, active: a.active });
}, { auth: "admin" });

export const DELETE = route(async (_req, { params }) => {
  const { id } = await params;
  await dbConnect();
  await Area.findByIdAndDelete(id);
  return ok({ ok: true });
}, { auth: "admin" });
