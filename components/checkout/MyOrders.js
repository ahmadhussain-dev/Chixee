"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPKR } from "@/lib/menu";
import { STATUS_COLOR, stepLabel } from "@/lib/status";
import { OrderRowsSkeleton } from "@/components/ui/Skeleton";

export default function MyOrders() {
  const [orders, setOrders] = useState(null);
  useEffect(() => {
    fetch("/api/orders").then((r) => (r.ok ? r.json() : [])).then(setOrders);
  }, []);
  if (!orders) return <OrderRowsSkeleton />;
  if (!orders.length) return <div className="card p-10 text-center text-muted">No orders yet. <Link href="/#menu" className="font-semibold text-maroon">Order something tasty</Link>.</div>;
  return (
    <ul className="grid gap-3">
      {orders.map((o) => (
        <li key={o.code}>
          <Link href={`/order/${o.code}`} className="card flex flex-wrap items-center justify-between gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(107,13,17,.1)]">
            <div>
              <b className="tracking-wide">{o.code}</b>
              <p className="text-sm text-muted">{new Date(o.createdAt).toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })} · {o.lines.reduce((s, l) => s + l.qty, 0)} items</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_COLOR[o.status]}`}>{stepLabel(o.status, o.type)}</span>
              <b className="tabular-nums">{formatPKR(o.total)}</b>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
