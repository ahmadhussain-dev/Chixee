import "server-only";
import * as webpush from "web-push";
import { dbConnect } from "@/lib/db";
import PushSub from "@/models/PushSub";
import Setting from "@/models/Setting";
import { log } from "@/lib/log";
import { SITE } from "@/data/site";

// Web Push: notifications on Android (Chrome, Edge, Samsung Internet...) even when the site is closed.
// Keys: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY if set, otherwise a pair made once and kept in MongoDB, so no setup is needed.

let vapid = null;
export async function getVapid() {
  if (vapid) return vapid;
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    vapid = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
  } else {
    await dbConnect();
    let s = await Setting.findOne({ key: "store" }).select("+vapidPrivate vapidPublic").lean();
    if (!s?.vapidPublic || !s?.vapidPrivate) {
      const k = webpush.generateVAPIDKeys();
      // Only fills empty keys, so two servers starting together end up with the same pair.
      await Setting.updateOne({ key: "store" }, { $setOnInsert: { key: "store" } }, { upsert: true });
      await Setting.updateOne({ key: "store", vapidPublic: { $in: ["", null] } }, { $set: { vapidPublic: k.publicKey, vapidPrivate: k.privateKey } });
      s = await Setting.findOne({ key: "store" }).select("+vapidPrivate vapidPublic").lean();
      log.info("push.keys_created");
    }
    vapid = { publicKey: s.vapidPublic, privateKey: s.vapidPrivate };
  }
  const subject = process.env.VAPID_SUBJECT || (SITE.url?.startsWith("https://") ? SITE.url : "mailto:noreply@chixee.vercel.app");
  webpush.setVapidDetails(subject, vapid.publicKey, vapid.privateKey);
  return vapid;
}

// payload: { title, body, url, tag }
async function sendTo(subs, payload) {
  if (!subs.length) return 0;
  await getVapid();
  const body = JSON.stringify({ icon: "/icon.png", badge: "/icon.png", ...payload });
  let sent = 0;
  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, body, { TTL: 60 * 60, urgency: "high" });
        sent++;
      } catch (e) {
        // 404/410: the browser unsubscribed or the subscription expired.
        if (e.statusCode === 404 || e.statusCode === 410) await PushSub.deleteOne({ _id: s._id }).catch(() => {});
        else log.warn("push.failed", { status: e.statusCode, error: e.message });
      }
    })
  );
  return sent;
}

export async function notifyAdmins(payload) {
  try {
    await dbConnect();
    const sent = await sendTo(await PushSub.find({ role: "admin" }).lean(), payload);
    log.info("push.admins", { tag: payload.tag, sent });
  } catch (e) {
    log.error("push.admins_failed", { error: e.message });
  }
}

export async function notifyOrder(code, payload) {
  try {
    await dbConnect();
    const sent = await sendTo(await PushSub.find({ orders: code }).lean(), payload);
    log.info("push.order", { code, tag: payload.tag, sent });
  } catch (e) {
    log.error("push.order_failed", { code, error: e.message });
  }
}

// What the customer is told at each step (statuses not listed send nothing).
export function customerMessage(order) {
  const pickup = order.type === "pickup";
  switch (order.status) {
    case "accepted": return { title: "Order accepted ✅", body: `${SITE.shortName} has accepted order ${order.code}. We're on it!` };
    case "ready": return pickup ? { title: "Ready for pickup 🍗", body: `Order ${order.code} is ready at ${SITE.branch.name}.` } : null;
    case "dispatched": return { title: "Rider on the way 🛵", body: `${order.rider?.name || "Your rider"} is bringing order ${order.code}.${order.rider?.phone ? ` Call ${order.rider.phone}.` : ""}` };
    case "delivered": return { title: pickup ? "Order collected" : "Order delivered", body: `Enjoy your meal! Thanks for ordering from ${SITE.shortName}.` };
    case "cancelled": return { title: "Order cancelled", body: `Order ${order.code} was cancelled. Call ${SITE.uan} if you have questions.` };
    default: return null;
  }
}
