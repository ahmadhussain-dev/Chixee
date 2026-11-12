import { dbConnect } from "@/lib/db";
import Order, { ORDER_STATUSES } from "@/models/Order";
import { ok, fail, route, readJson } from "@/lib/api";
import { clean, isPhone, normalizePhone } from "@/lib/validate";
import { publish } from "@/lib/orderEvents";
import { adminOrder } from "@/lib/orders";
import { after } from "next/server";
import { customerMessage, notifyOrder } from "@/lib/push";
import { log } from "@/lib/log";

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

export const PATCH = route(async (req, { params }, { session, requestId }) => {
  const { code } = await params;
  const b = await readJson(req);
  await dbConnect();
  const order = await Order.findOne({ code });
  if (!order) return fail("Order not found.", 404);

  if (typeof b.paymentVerified === "boolean") order.payment.verified = b.paymentVerified;

  if (b.rider) {
    const name = clean(b.rider.name, 60);
    const phone = normalizePhone(b.rider.phone);
    if (!name || !isPhone(phone)) return fail("Enter the rider's name and a valid mobile number.", 422);
    order.rider = { name, phone };
  }

  const statusChanged = !!b.status && b.status !== order.status;
  if (statusChanged) {
    if (!ORDER_STATUSES.includes(b.status) || !NEXT[order.status].includes(b.status))
      return fail(`Can't move an order from ${order.status} to ${b.status}.`, 409);
    if (b.status === "dispatched" && order.type === "delivery" && !order.rider?.name)
      return fail("Add rider details before dispatching.", 422);
    order.status = b.status;
    order.history.push({ status: b.status, note: clean(b.note, 200) });
  }

  await order.save();
  const o = order.toObject();
  publish(o);
  if (statusChanged) {
    log.info("order.status", { requestId, code: o.code, status: o.status, by: session.user.id });
    const msg = customerMessage(o);
    if (msg) after(() => notifyOrder(o.code, { ...msg, url: `/order/${o.code}`, tag: `order-${o.code}` }));
  }
  return ok(adminOrder(o));
}, { auth: "admin" });
