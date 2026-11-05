"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";
import { AreaRowsSkeleton } from "@/components/ui/Skeleton";

const api = async (url, method, body) => {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d;
};

function Row({ area, onSaved, onDeleted }) {
  const [v, setV] = useState(area);
  const dirty = v.name !== area.name || +v.eta !== area.eta || +v.fee !== area.fee || v.active !== area.active;
  const [err, setErr] = useState("");
  const save = async () => { try { onSaved(await api(`/api/admin/areas/${area.id}`, "PATCH", v)); setErr(""); } catch (e) { setErr(e.message); } };
  const lbl = "text-[11px] font-semibold uppercase tracking-wide text-muted sm:sr-only";
  return (
    <li className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line p-4 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_96px_112px_64px_120px] sm:items-center sm:gap-3 sm:px-3 sm:py-2">
      <label className="col-span-2 grid gap-1 sm:col-span-1"><span className={lbl}>Area</span><input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className="input py-2" /></label>
      <label className="grid gap-1"><span className={lbl}>ETA (min)</span><input type="number" inputMode="numeric" min={5} value={v.eta} onChange={(e) => setV({ ...v, eta: e.target.value })} className="input w-full py-2" /></label>
      <label className="grid gap-1"><span className={lbl}>Fee (Rs.)</span><input type="number" inputMode="numeric" min={0} value={v.fee} onChange={(e) => setV({ ...v, fee: e.target.value })} className="input w-full py-2" /></label>
      <label className="flex items-center gap-2 text-sm font-semibold sm:justify-center">
        <input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} className="size-5 accent-maroon" />
        <span className="sm:sr-only">Active</span>
      </label>
      <div className="flex items-center justify-end gap-2">
        <button disabled={!dirty} onClick={save} className="rounded-lg bg-maroon px-4 py-2 text-sm font-bold text-white disabled:opacity-30">Save</button>
        <button onClick={async () => { if (confirm(`Delete ${area.name}?`)) { await api(`/api/admin/areas/${area.id}`, "DELETE"); onDeleted(area.id); } }} aria-label={`Delete ${area.name}`} className="grid size-9 place-items-center rounded-lg text-maroon hover:bg-red-50"><Icon name="trash" className="size-5" /></button>
      </div>
      {err && <p className="col-span-2 text-xs text-maroon sm:col-span-5">{err}</p>}
    </li>
  );
}

export default function AreasManager() {
  const [areas, setAreas] = useState(null);
  const [form, setForm] = useState({ name: "", eta: 45, fee: 150 });
  const [err, setErr] = useState("");
  useEffect(() => { api("/api/admin/areas", "GET").then(setAreas).catch((e) => setErr(e.message)); }, []);

  return (
    <div>
      <h1 className="heading mb-2 text-3xl sm:text-4xl">Delivery areas</h1>
      <p className="mb-5 text-muted">These appear in the area dropdown customers see first. ETA is in minutes, fee in rupees. Untick “Active” to hide an area without deleting it.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try { const a = await api("/api/admin/areas", "POST", form); setAreas((l) => [...l, a].sort((x, y) => x.name.localeCompare(y.name))); setForm({ ...form, name: "" }); setErr(""); }
          catch (e2) { setErr(e2.message); }
        }}
        className="card mb-5 grid grid-cols-2 gap-3 p-4 sm:grid-cols-[1fr_120px_140px_auto] sm:items-end"
      >
        <label className="label col-span-2 sm:col-span-1">New area<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Madina Town" className="input" /></label>
        <label className="label">ETA (min)<input type="number" min={5} value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} className="input" /></label>
        <label className="label">Fee (Rs.)<input type="number" min={0} value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="input" /></label>
        <button className="btn-maroon col-span-2 py-3 sm:col-span-1"><Icon name="plus" className="size-5" />Add</button>
      </form>
      {err && <p className="mb-4 rounded-xl bg-red-50 p-3 text-maroon">{err}</p>}
      <div className="card overflow-hidden">
        <div aria-hidden="true" className="hidden bg-cream px-3 py-3 text-left text-sm font-semibold text-muted sm:grid sm:grid-cols-[minmax(0,1fr)_96px_112px_64px_120px] sm:gap-3">
          <span>Area</span><span>ETA (min)</span><span>Fee (Rs.)</span><span className="text-center">Active</span><span />
        </div>
        {!areas && <AreaRowsSkeleton />}
        {areas?.length === 0 && <p className="p-6 text-center text-muted">No areas yet. Add one above or run <code>npm run seed</code>.</p>}
        <ul className="sm:border-t sm:border-line">
          {areas?.map((a) => (
            <Row key={a.id} area={a} onSaved={(n) => setAreas((l) => l.map((x) => (x.id === n.id ? n : x)))} onDeleted={(id) => setAreas((l) => l.filter((x) => x.id !== id))} />
          ))}
        </ul>
      </div>
    </div>
  );
}
