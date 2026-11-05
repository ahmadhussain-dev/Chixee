// Orders placed or tracked on this device, newest first, so guests can get back to them
// without remembering the order number. Kept in localStorage: [{ code, type, at }].
const KEY = "chixee.orders.v1";
const MAX = 10;
export const RECENT_ORDERS_EVENT = "chixee:orders";

export function getRecentOrders() {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(list) ? list.filter((o) => o && typeof o.code === "string") : [];
  } catch {
    return [];
  }
}

export function rememberOrder(order) {
  if (!order?.code) return;
  try {
    const rest = getRecentOrders().filter((o) => o.code !== order.code);
    const entry = { code: order.code, type: order.type, at: order.createdAt || new Date().toISOString(), total: order.total };
    localStorage.setItem(KEY, JSON.stringify([entry, ...rest].slice(0, MAX)));
    window.dispatchEvent(new Event(RECENT_ORDERS_EVENT));
  } catch {}
}
