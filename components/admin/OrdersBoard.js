"use client";
import { useCallback, useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { formatPKR } from "@/data/menu";
import { STATUS_COLOR, stepLabel } from "@/lib/status";

const FILTERS = [["active", "Active"], ["pending", "Pending"], ["preparing", "Preparing"], ["dispatched", "Dispatched"], ["delivered", "Delivered"], ["cancelled", "Cancelled"], ["all", "All"]];

async function patch(code, body) {
  const r = await fetch(`/api/admin/orders/${code}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || "Update failed");
  return data;
}

function RiderForm({ order, onSaved }) {
  const [name, setName] = useState(order.rider?.name || "");
  const [phone, setPhone] = useState(order.rider?.phone || "");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setErr(""); setBusy(true);
        try { onSaved(await patch(order.code, { rider: { name, phone }, status: "dispatched" })); }
        catch (e2) { setErr(e2.message); }
        setBusy(false);
      }}
      className="grid gap-2 rounded-xl bg-cream p-3 sm:grid-cols-[1fr_1fr_auto]"
    >
      <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Rider name" className="input py-2" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Rider mobile 03XX…" className="input py-2" />
      <button disabled={busy} className="btn-maroon px-4 py-2"><Icon name="bike" className="size-5" />Dispatch</button>
      {err && <p className="text-sm text-maroon sm:col-span-3">{err}</p>}
    </form>
  );
}

function OrderCard({ order, onChange }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const act = async (body) => {
    setErr(""); setBusy(true);
    try { onChange(await patch(order.code, body)); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  const created = new Date(order.createdAt);
  const s = order.status;
  const btn = "rounded-lg px-4 py-2 text-sm font-bold transition disabled:opacity-50";

  return (
    <article className="card grid gap-4 p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <b className="text-lg tracking-wide">{order.code}</b>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[s]}`}>{stepLabel(s, order.type)}</span>
            <span className="rounded-full bg-yellow-soft px-2.5 py-0.5 text-xs font-semibold text-maroon-dark">{order.type === "pickup" ? "Pickup" : `Delivery · ${order.address?.area}`}</span>
          </div>
          <p className="mt-1 text-sm text-muted">{created.toLocaleString("en-PK", { dateStyle: "medium", timeStyle: "short" })}</p>
        </div>
        <b className="text-xl tabular-nums">{formatPKR(order.total)}</b>
      </header>

      <div className="grid gap-4 text-sm md:grid-cols-3">
        <div>
          <h3 className="mb-1 font-semibold text-muted">Customer</h3>
          <p className="font-semibold">{order.customer.name}</p>
          <a href={`tel:${order.customer.phone}`} className="text-maroon underline">{order.customer.phone}</a>
          {order.customer.altPhone && <p>Alt: {order.customer.altPhone}</p>}
          {order.customer.email && <p className="break-all text-muted">{order.customer.email}</p>}
          {order.type === "delivery" && <p className="mt-1">{order.address?.line}</p>}
        </div>
        <div>
          <h3 className="mb-1 font-semibold text-muted">Items</h3>
          <ul className="grid gap-0.5">
            {order.lines.map((l, i) => <li key={i}>{l.qty} × {l.name}{l.size ? ` (${l.size})` : ""}</li>)}
          </ul>
          {order.instructions && <p className="mt-2 rounded-lg bg-yellow-soft p-2"><b>Note:</b> {order.instructions}</p>}
        </div>
        <div>
          <h3 className="mb-1 font-semibold text-muted">Payment</h3>
          <p>{order.payment.method === "cod" ? "Cash on Delivery" : "Account transfer"}</p>
          {order.payment.method === "transfer" && (
            <>
              <p>Txn ID: <b>{order.payment.transactionId}</b></p>
              <label className="mt-1 flex items-center gap-2">
                <input type="checkbox" checked={!!order.payment.verified} disabled={busy} onChange={(e) => act({ paymentVerified: e.target.checked })} className="size-4 accent-maroon" />
                {order.payment.verified ? <span className="font-semibold text-green-700">Verified</span> : <span className="font-semibold text-amber-700">Mark as verified</span>}
              </label>
            </>
          )}
          {order.rider?.name && <p className="mt-2">Rider: <b>{order.rider.name}</b> · {order.rider.phone}</p>}
        </div>
      </div>

      <footer className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          {s === "pending" && <button disabled={busy} onClick={() => act({ status: "accepted" })} className={`${btn} bg-green-600 text-white hover:bg-green-700`}>Accept order</button>}
          {s === "accepted" && <button disabled={busy} onClick={() => act({ status: "preparing" })} className={`${btn} bg-yellow text-maroon-dark`}>Start preparing</button>}
          {s === "preparing" && <button disabled={busy} onClick={() => act({ status: "ready" })} className={`${btn} bg-yellow text-maroon-dark`}>Food is ready</button>}
          {s === "ready" && order.type === "pickup" && <button disabled={busy} onClick={() => act({ status: "delivered" })} className={`${btn} bg-green-600 text-white`}>Collected by customer</button>}
          {s === "dispatched" && <button disabled={busy} onClick={() => act({ status: "delivered" })} className={`${btn} bg-green-600 text-white`}>Mark delivered</button>}
          {["pending", "accepted", "preparing", "ready"].includes(s) && (
            <button disabled={busy} onClick={() => confirm(`Cancel order ${order.code}?`) && act({ status: "cancelled" })} className={`${btn} text-maroon ring-1 ring-maroon hover:bg-red-50`}>Cancel</button>
          )}
        </div>
        {s === "ready" && order.type === "delivery" && <RiderForm order={order} onSaved={onChange} />}
        {err && <p className="text-sm font-semibold text-maroon">{err}</p>}
      </footer>
    </article>
  );
}

export default function OrdersBoard() {
  const [filter, setFilter] = useState("active");
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const r = await fetch(`/api/admin/orders?status=${filter}`, { cache: "no-store" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) setError(data.error || "Couldn't load orders");
    else { setError(""); setOrders(data); }
  }, [filter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() only sets state after the fetch resolves
    load();
    const t = setInterval(load, 15000); // new orders show up within 15 seconds
    return () => clearInterval(t);
  }, [load]);

  const pending = orders?.filter((o) => o.status === "pending").length || 0;
  const update = (o) => setOrders((list) => list.map((x) => (x.code === o.code ? o : x)));

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading text-4xl">Orders</h1>
        {pending > 0 && <span className="animate-pulse rounded-full bg-maroon px-3 py-1 text-sm font-bold text-white">{pending} waiting to accept</span>}
      </div>
      <div className="no-scrollbar mb-5 flex gap-2 overflow-x-auto">
        {FILTERS.map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} className={`flex-none rounded-full px-4 py-2 text-sm font-semibold transition ${filter === k ? "bg-maroon text-white" : "bg-white text-ink ring-1 ring-line hover:ring-maroon"}`}>{label}</button>
        ))}
      </div>
      {error && <p className="rounded-xl bg-red-50 p-4 text-maroon">{error}</p>}
      {!orders && !error && <div className="card h-48 animate-pulse" />}
      {orders && !orders.length && <div className="card p-10 text-center text-muted">No orders here.</div>}
      <div className="grid gap-4">{orders?.map((o) => <OrderCard key={o.code} order={o} onChange={update} />)}</div>
    </div>
  );
}
