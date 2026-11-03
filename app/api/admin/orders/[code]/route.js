import { dbConnect } from "@/lib/db";
import Order, { ORDER_STATUSES } from "@/models/Order";
import { requireAdmin } from "@/lib/auth";
import { ok, fail, handle } from "@/lib/api";
import { clean, isPhone, normalizePhone } from "@/lib/validate";

// Allowed next steps for each status
const NEXT = {
  pending: ["accepted", "cancelled"],
  accepted: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["dispatched", "delivered", "cancelled"], // pickup orders go straight to delivered (collected)
  dispatched: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const PATCH = handle(async (req, { params }) => {
  if (!(await requireAdmin())) return fail("Admins only.", 403);
  const { code } = await params;
  const b = await req.json();
  await dbConnect();
  const order = await Order.findOne({ code });
  if (!order) return fail("Order not found.", 404);

  if (typeof b.paymentVerified === "boolean") order.payment.verified = b.paymentVerified;

  if (b.rider) {
    const name = clean(b.rider.name, 60);
    const phone = normalizePhone(b.rider.phone);
    if (!name || !isPhone(phone)) return fail("Enter the rider's name and a valid mobile number.");
    order.rider = { name, phone };
  }

  if (b.status && b.status !== order.status) {
    if (!ORDER_STATUSES.includes(b.status) || !NEXT[order.status].includes(b.status))
      return fail(`Can't move an order from ${order.status} to ${b.status}.`);
    if (b.status === "dispatched" && order.type === "delivery" && !order.rider?.name)
      return fail("Add rider details before dispatching.");
    order.status = b.status;
    order.history.push({ status: b.status, note: clean(b.note, 200) });
  }

  await order.save();
  const o = order.toObject();
  return ok({ ...o, _id: o._id.toString(), user: o.user?.toString() || null });
});
