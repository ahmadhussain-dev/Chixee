import { dbConnect } from "@/lib/db";
import Area from "@/models/Area";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";
import { clean } from "@/lib/validate";

export const dynamic = "force-dynamic";

const shape = (a) => ({ id: a._id.toString(), name: a.name, city: a.city, eta: a.eta, fee: a.fee, active: a.active });

export const GET = handle(async () => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  await dbConnect();
  return ok((await Area.find().sort({ name: 1 }).lean()).map(shape));
});

export const POST = handle(async (req) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const b = await req.json();
  const name = clean(b.name, 80);
  if (!name) return fail("Area name is required.");
  await dbConnect();
  try {
    const a = await Area.create({ name, city: clean(b.city, 40) || "Faisalabad", eta: Number(b.eta) || 45, fee: Math.max(0, Number(b.fee) || 0) });
    return ok(shape(a), { status: 201 });
  } catch (e) {
    if (e.code === 11000) return fail("That area already exists.", 409);
    throw e;
  }
});
