"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEventStream from "@/hooks/useEventStream";
import Icon from "@/components/ui/Icon";
import { formatPKR } from "@/data/menu";
import { SITE } from "@/data/site";
import { STATUS_STEPS, stepLabel } from "@/lib/status";
import { rememberOrder } from "@/lib/recent-orders";

const fmtTime = (d) => new Date(d).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" });

export default function OrderTracker({ code, isNew }) {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/orders/${code}`, { cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) setError(data.error || "Order not found.");
    else {
      setOrder(data);
      rememberOrder(data); // so the live order bar and "Orders on this phone" can find it again
    }
  }, [code]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() only sets state after the fetch resolves
    load();
  }, [load]);

  // Live updates pushed from the server; stops listening once the order is finished.
  const finished = order && ["delivered", "cancelled"].includes(order.status);
  useEventStream(order && !finished ? `/api/orders/${code}/stream` : null, { onOrder: setOrder, onOpen: (reconnect) => reconnect && load() });

  if (error) return <div className="card mx-auto max-w-md p-8 text-center"><h1 className="heading text-3xl">Order not found</h1><p className="mt-2 text-muted">Check the order number and try again.</p><Link href="/track" className="btn-yellow mt-5">Track another order</Link></div>;
  if (!order) return <div className="card mx-auto h-80 max-w-2xl animate-pulse" />;

  const steps = STATUS_STEPS[order.type];
  const idx = steps.indexOf(order.status);
  const cancelled = order.status === "cancelled";
  const timeOf = (s) => order.history?.find((h) => h.status === s)?.at;

  return (
    <div className="mx-auto grid max-w-2xl gap-5">
      {isNew && (
        <div className="flex animate-fade-up items-center gap-3 rounded-2xl bg-green-50 p-4 text-green-900 ring-1 ring-green-200">
          <Icon name="check" className="size-7 flex-none" />
          <p><b>Thank you, {order.customerName}!</b> Your order has been placed. Keep this page open to follow it.</p>
        </div>
      )}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">Order number</p>
            <h1 className="heading text-3xl tracking-wide">{order.code}</h1>
          </div>
          <span className="rounded-full bg-yellow-soft px-3 py-1.5 text-sm font-semibold text-maroon-dark">{order.type === "pickup" ? `Pickup · ${SITE.branch.name}` : `Delivery · ${order.area}`}</span>
        </div>

        {cancelled ? (
          <p className="mt-6 rounded-xl bg-red-50 p-4 font-semibold text-maroon">This order was cancelled. Please call {SITE.uan} if you have questions.</p>
        ) : (
          <ol className="mt-8 grid gap-0">
            {steps.map((s, i) => {
              const done = i <= idx;
              const current = i === idx;
              return (
                <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < steps.length - 1 && <span className={`absolute left-[15px] top-8 h-[calc(100%-32px)] w-0.5 ${i < idx ? "bg-maroon" : "bg-line"}`} />}
                  <span className={`relative z-[1] grid size-8 flex-none place-items-center rounded-full text-sm font-bold ${done ? "bg-maroon text-white" : "bg-line text-muted"} ${current ? "ring-4 ring-yellow" : ""}`}>
                    {done ? <Icon name="check" className="size-5" /> : i + 1}
                  </span>
                  <div className="pt-1">
                    <b className={done ? "" : "text-muted"}>{stepLabel(s, order.type)}</b>
                    {timeOf(s) && <span className="ml-2 text-sm text-muted">{fmtTime(timeOf(s))}</span>}
                    {s === "dispatched" && current && order.rider?.name && (
                      <p className="mt-1 text-sm">Rider <b>{order.rider.name}</b> · <a href={`tel:${order.rider.phone}`} className="font-semibold text-maroon underline">{order.rider.phone}</a></p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="card p-6">
        <h2 className="mb-3 text-lg font-bold">Order summary</h2>
        <ul className="grid gap-2 text-sm">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-3"><span>{l.qty} × {l.name}{l.size ? ` (${l.size})` : ""}{l.note && <i className="block text-xs text-muted">{l.note}</i>}</span><span className="tabular-nums">{formatPKR(l.total)}</span></li>
          ))}
        </ul>
        <div className="mt-3 grid gap-1 border-t border-line pt-3 text-sm tabular-nums">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span>{formatPKR(order.subtotal)}</span></div>
          {order.type === "delivery" && <div className="flex justify-between text-muted"><span>Delivery fee</span><span>{formatPKR(order.deliveryFee)}</span></div>}
          <div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPKR(order.total)}</span></div>
          <div className="mt-1 flex justify-between text-muted">
            <span>Payment</span>
            <span>{order.payment.method === "cod" ? "Cash on Delivery" : `Account transfer · ${order.payment.verified ? "verified" : "awaiting verification"}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
