import { dbConnect } from "@/lib/db";
import Setting from "@/models/Setting";
import { ok, fail, route, readJson } from "@/lib/api";
import { clean } from "@/lib/validate";

const FIELDS = ["bankName", "accountTitle", "accountNumber", "iban", "jazzcashNumber", "jazzcashTitle"];

export const PUT = route(async (req) => {
  const b = await readJson(req);
  const set = {};
  for (const f of FIELDS) if (b[f] !== undefined) set[f] = clean(b[f], 80);
  if (b.acceptingOrders !== undefined) set.acceptingOrders = !!b.acceptingOrders;
  await dbConnect();
  const s = await Setting.findOneAndUpdate({ key: "store" }, set, { new: true, upsert: true }).lean();
  return ok(s);
}, { auth: "admin" });
