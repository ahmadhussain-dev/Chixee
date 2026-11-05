"use client";
import { useEffect, useState } from "react";
import { formatPKR } from "@/data/menu";
import { ReportsSkeleton } from "@/components/ui/Skeleton";

const PERIODS = [["daily", "Today"], ["weekly", "This week"], ["monthly", "This month"]];

function Stat({ label, value, sub }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
    </div>
  );
}

export default function Reports() {
  const [period, setPeriod] = useState("daily");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/reports?period=${period}`, { cache: "no-store" })
      .then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error); setData(d); setError(""); })
      .catch((e) => setError(e.message || "Couldn't load report"));
  }, [period]);

  const s = data?.summary;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading text-4xl">Reports</h1>
        <div className="flex gap-2 rounded-full bg-white p-1 ring-1 ring-line">
          {PERIODS.map(([k, label]) => (
            <button key={k} onClick={() => setPeriod(k)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${period === k ? "bg-maroon text-white" : "hover:text-maroon"}`}>{label}</button>
          ))}
        </div>
      </div>
      {error && <p className="rounded-xl bg-red-50 p-4 text-maroon">{error}</p>}
      {!data && !error && <ReportsSkeleton />}
      {data && (
        <div className="grid gap-6">
          <p className="text-sm text-muted">Since {new Date(data.from).toLocaleString("en-PK", { dateStyle: "full", timeStyle: "short" })}. Cancelled orders are not counted ({data.cancelled} cancelled).</p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Revenue" value={formatPKR(s.revenue)} sub={`incl. ${formatPKR(s.deliveryFees)} delivery fees`} />
            <Stat label="Orders" value={s.orders} sub={`${s.delivered} delivered`} />
            <Stat label="Cash on Delivery" value={formatPKR(s.cod)} sub={`${s.codOrders} orders`} />
            <Stat label="Online / transfer" value={formatPKR(s.online)} sub={`${s.onlineOrders} orders · ${s.onlineUnverified} unverified`} />
          </div>

          <section className="card overflow-hidden">
            <h2 className="border-b border-line px-5 py-4 text-lg font-bold">Items sold</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-cream text-left text-muted">
                  <tr><th className="px-5 py-3 font-semibold">Item</th><th className="px-5 py-3 text-right font-semibold">Price</th><th className="px-5 py-3 text-right font-semibold">Qty</th><th className="px-5 py-3 text-right font-semibold">Revenue</th></tr>
                </thead>
                <tbody>
                  {!data.items.length && <tr><td colSpan={4} className="px-5 py-6 text-center text-muted">No sales in this period yet.</td></tr>}
                  {data.items.map((i) => (
                    <tr key={i.name + i.size} className="border-t border-line">
                      <td className="px-5 py-3">{i.name}{i.size ? ` (${i.size})` : ""}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{formatPKR(i.price)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{i.qty}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatPKR(i.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {period !== "daily" && (
            <section className="card overflow-hidden">
              <h2 className="border-b border-line px-5 py-4 text-lg font-bold">By day</h2>
              <table className="w-full text-sm">
                <thead className="bg-cream text-left text-muted"><tr><th className="px-5 py-3 font-semibold">Day</th><th className="px-5 py-3 text-right font-semibold">Orders</th><th className="px-5 py-3 text-right font-semibold">Revenue</th></tr></thead>
                <tbody>
                  {data.byDay.map((d) => (
                    <tr key={d.day} className="border-t border-line">
                      <td className="px-5 py-3">{new Date(d.day + "T00:00:00").toLocaleDateString("en-PK", { weekday: "short", day: "numeric", month: "short" })}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{d.orders}</td>
                      <td className="px-5 py-3 text-right font-semibold tabular-nums">{formatPKR(d.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
