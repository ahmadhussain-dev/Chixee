import { dbConnect } from "@/lib/db";
import Setting from "@/models/Setting";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";
import { clean } from "@/lib/validate";

const FIELDS = ["bankName", "accountTitle", "accountNumber", "iban", "jazzcashNumber", "jazzcashTitle"];

export const PUT = handle(async (req) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const b = await req.json();
  const set = {};
  for (const f of FIELDS) if (b[f] !== undefined) set[f] = clean(b[f], 80);
  if (b.acceptingOrders !== undefined) set.acceptingOrders = !!b.acceptingOrders;
  await dbConnect();
  const s = await Setting.findOneAndUpdate({ key: "store" }, set, { new: true, upsert: true }).lean();
  return ok(s);
});
