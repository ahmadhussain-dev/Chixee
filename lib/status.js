// Customer-facing wording for each order status.
export const STATUS_LABEL = {
  pending: "Waiting for confirmation",
  accepted: "Order accepted",
  preparing: "Preparing your food",
  ready: "Food is ready",
  dispatched: "Rider on the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_STEPS = {
  delivery: ["pending", "accepted", "preparing", "ready", "dispatched", "delivered"],
  pickup: ["pending", "accepted", "preparing", "ready", "delivered"],
};

export const stepLabel = (status, type) =>
  type === "pickup" && status === "delivered" ? "Collected" : type === "pickup" && status === "ready" ? "Ready for pickup" : STATUS_LABEL[status];

export const STATUS_COLOR = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-sky-100 text-sky-800",
  preparing: "bg-orange-100 text-orange-800",
  ready: "bg-violet-100 text-violet-800",
  dispatched: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};
