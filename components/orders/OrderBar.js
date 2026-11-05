"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bike, ChevronRight, Store } from "lucide-react";
import useEventStream from "@/hooks/useEventStream";
import useFooterGap from "@/hooks/useFooterGap";
import { useCart } from "@/context/CartContext";
import { RECENT_ORDERS_EVENT, getRecentOrders } from "@/lib/recent-orders";
import { stepLabel } from "@/lib/status";

const FRESH_MS = 12 * 60 * 60 * 1000; // only orders from the last 12 hours count as "live"
const DONE = ["delivered", "cancelled"];
// Short status words that fit the bar on a phone.
const SHORT = { pending: "Being confirmed", accepted: "Order accepted", preparing: "Preparing your food", ready: "Ready", dispatched: "Rider on the way" };
const shortLabel = (o) => (o.status === "ready" && o.type === "pickup" ? "Ready for pickup" : SHORT[o.status] || stepLabel(o.status, o.type));

// Live order bar: after someone places an order, a small bar sits at the bottom-left of every page
// with its status and a Track link, until the order is delivered or cancelled. Works for guests,
// because the order number is remembered on this device (lib/recent-orders).
export default function OrderBar() {
  const pathname = usePathname();
  const { count } = useCart();
  const footerGap = useFooterGap();
  const [code, setCode] = useState(null);
  const [order, setOrder] = useState(null);

  // Pick the newest recent order, and follow changes (a new order placed in this tab or another).
  useEffect(() => {
    const pick = () => {
      const latest = getRecentOrders().find((o) => Date.now() - new Date(o.at).getTime() < FRESH_MS);
      setCode(latest?.code || null);
    };
    pick();
    addEventListener(RECENT_ORDERS_EVENT, pick);
    addEventListener("storage", pick);
    return () => {
      removeEventListener(RECENT_ORDERS_EVENT, pick);
      removeEventListener("storage", pick);
    };
  }, []);

  const load = useCallback(async () => {
    if (!code) return setOrder(null);
    const r = await fetch(`/api/orders/${code}`, { cache: "no-store" }).catch(() => null);
    setOrder(r?.ok ? await r.json() : null);
  }, [code]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets state after the fetch
    load();
  }, [load]);

  const live = order && !DONE.includes(order.status);
  useEventStream(live ? `/api/orders/${order.code}/stream` : null, { onOrder: setOrder, onOpen: (re) => re && load() });

  // Not on the order's own page, at checkout, or once it's finished.
  const hidden = !live || pathname === "/checkout" || pathname?.toUpperCase() === `/ORDER/${order?.code}`;
  if (hidden) return null;
  const Ico = order.type === "pickup" ? Store : Bike;

  return (
    <Link
      href={`/order/${order.code}`}
      style={{ marginBottom: footerGap }}
      aria-label={`Your order ${order.code}: ${stepLabel(order.status, order.type)}. Track order`}
      className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-[max(16px,env(safe-area-inset-left))] z-[58] flex animate-fade-up items-center gap-2.5 rounded-[20px] bg-night py-2 pl-2 pr-3 text-white shadow-[0_14px_34px_rgba(0,0,0,.35)] transition hover:-translate-y-0.5 sm:bottom-5 sm:left-5 sm:w-[340px] ${
        count ? "right-[184px] sm:right-auto" : "right-[80px] sm:right-auto"
      }`}
    >
      <span className="relative grid size-11 flex-none place-items-center rounded-full bg-yellow text-maroon-dark">
        <Ico aria-hidden="true" strokeWidth={2.2} className="size-[22px]" />
        <span className="absolute right-0 top-0 size-3 animate-pulse rounded-full bg-green-500 ring-2 ring-night" />
      </span>
      <span className="min-w-0 leading-tight">
        <small className="block truncate text-[11px] text-on-night-muted">Your order {order.code}</small>
        <b className="block truncate text-[13.5px] text-yellow">{shortLabel(order)}</b>
      </span>
      <span className="ml-auto flex flex-none items-center text-[13px] font-bold">
        <span className="hidden min-[380px]:inline">Track</span>
        <ChevronRight aria-hidden="true" className="size-4" />
      </span>
    </Link>
  );
}
