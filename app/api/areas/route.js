import { dbConnect } from "@/lib/db";
import Area from "@/models/Area";
import { ok, handle } from "@/lib/api";

export const dynamic = "force-dynamic";

export const GET = handle(async () => {
  await dbConnect();
  const areas = await Area.find({ active: true }).sort({ name: 1 }).lean();
  return ok(areas.map((a) => ({ id: a._id.toString(), name: a.name, city: a.city, eta: a.eta, fee: a.fee })));
});
