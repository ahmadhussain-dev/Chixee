import { dbConnect } from "@/lib/db";
import Area from "@/models/Area";
import { ok, fail, route, readJson } from "@/lib/api";
import { clean } from "@/lib/validate";

export const dynamic = "force-dynamic";

const shape = (a) => ({ id: a._id.toString(), name: a.name, city: a.city, eta: a.eta, fee: a.fee, active: a.active });

export const GET = route(async () => {
  await dbConnect();
  return ok((await Area.find().sort({ name: 1 }).lean()).map(shape));
}, { auth: "admin" });

export const POST = route(async (req) => {
  const b = await readJson(req);
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
}, { auth: "admin" });
