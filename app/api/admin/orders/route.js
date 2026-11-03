import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";
import { adminOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const GET = handle(async (req) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = {};
  if (status && status !== "all") {
    q.status = status === "active" ? { $in: ["pending", "accepted", "preparing", "ready", "dispatched"] } : status;
  }
  await dbConnect();
  const orders = await Order.find(q).sort({ createdAt: -1 }).limit(200).lean();
  return ok(orders.map(adminOrder));
});
