import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";
import { ok, fail, handle } from "@/lib/api";
import { publicOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export const GET = handle(async (_req, { params }) => {
  const { code } = await params;
  await dbConnect();
  const order = await Order.findOne({ code: String(code).toUpperCase() }).lean();
  if (!order) return fail("Order not found.", 404);
  return ok(publicOrder(order));
});
