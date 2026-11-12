import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { ok, fail, route } from "@/lib/api";
import { adminOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const GET = route(async (req) => {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = {};
  if (status && status !== "all") {
    q.status = status === "active" ? { $in: ["pending", "accepted", "preparing", "ready", "dispatched"] } : status;
  }
  await dbConnect();
  const orders = await Order.find(q).sort({ createdAt: -1 }).limit(200).lean();
  return ok(orders.map(adminOrder));
}, { auth: "admin" });
