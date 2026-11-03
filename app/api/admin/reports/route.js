import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";

export const dynamic = "force-dynamic";

// Pakistan time (UTC+5, no DST) so "today" matches the restaurant's day.
const TZ = "+05:00";
const OFFSET = 5 * 60 * 60 * 1000;

function rangeFor(period) {
  const nowPk = new Date(Date.now() + OFFSET);
  const start = new Date(Date.UTC(nowPk.getUTCFullYear(), nowPk.getUTCMonth(), nowPk.getUTCDate()));
  if (period === "weekly") start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7)); // Monday
  if (period === "monthly") start.setUTCDate(1);
  return new Date(start.getTime() - OFFSET);
}

export const GET = handle(async (req) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const { searchParams } = new URL(req.url);
  const period = ["daily", "weekly", "monthly"].includes(searchParams.get("period")) ? searchParams.get("period") : "daily";
  const from = rangeFor(period);
  const match = { createdAt: { $gte: from }, status: { $ne: "cancelled" } };

  await dbConnect();
  const [summary] = await Order.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        orders: { $sum: 1 },
        revenue: { $sum: "$total" },
        deliveryFees: { $sum: "$deliveryFee" },
        cod: { $sum: { $cond: [{ $eq: ["$payment.method", "cod"] }, "$total", 0] } },
        codOrders: { $sum: { $cond: [{ $eq: ["$payment.method", "cod"] }, 1, 0] } },
        online: { $sum: { $cond: [{ $eq: ["$payment.method", "transfer"] }, "$total", 0] } },
        onlineOrders: { $sum: { $cond: [{ $eq: ["$payment.method", "transfer"] }, 1, 0] } },
        onlineUnverified: { $sum: { $cond: [{ $and: [{ $eq: ["$payment.method", "transfer"] }, { $ne: ["$payment.verified", true] }] }, 1, 0] } },
        delivered: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
      },
    },
  ]);

  const items = await Order.aggregate([
    { $match: match },
    { $unwind: "$lines" },
    { $group: { _id: { name: "$lines.name", size: "$lines.size" }, qty: { $sum: "$lines.qty" }, revenue: { $sum: "$lines.total" }, price: { $last: "$lines.price" } } },
    { $sort: { qty: -1 } },
  ]);

  const byDay = await Order.aggregate([
    { $match: match },
    { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ } }, orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
    { $sort: { _id: 1 } },
  ]);

  const cancelled = await Order.countDocuments({ createdAt: { $gte: from }, status: "cancelled" });

  return ok({
    period,
    from,
    summary: summary || { orders: 0, revenue: 0, deliveryFees: 0, cod: 0, codOrders: 0, online: 0, onlineOrders: 0, onlineUnverified: 0, delivered: 0 },
    cancelled,
    items: items.map((i) => ({ name: i._id.name, size: i._id.size, qty: i.qty, price: i.price, revenue: i.revenue })),
    byDay: byDay.map((d) => ({ day: d._id, orders: d.orders, revenue: d.revenue })),
  });
});
