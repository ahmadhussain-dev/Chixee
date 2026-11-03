"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

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
  return (
    <tr className="border-t border-line">
      <td className="px-3 py-2"><input value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} className="input py-2" aria-label="Area name" /></td>
      <td className="px-3 py-2"><input type="number" min={5} value={v.eta} onChange={(e) => setV({ ...v, eta: e.target.value })} className="input w-24 py-2" aria-label="ETA minutes" /></td>
      <td className="px-3 py-2"><input type="number" min={0} value={v.fee} onChange={(e) => setV({ ...v, fee: e.target.value })} className="input w-28 py-2" aria-label="Delivery fee" /></td>
      <td className="px-3 py-2 text-center"><input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} className="size-5 accent-maroon" aria-label="Active" /></td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <button disabled={!dirty} onClick={save} className="rounded-lg bg-maroon px-3 py-2 text-sm font-bold text-white disabled:opacity-30">Save</button>
          <button onClick={async () => { if (confirm(`Delete ${area.name}?`)) { await api(`/api/admin/areas/${area.id}`, "DELETE"); onDeleted(area.id); } }} aria-label={`Delete ${area.name}`} className="grid size-9 place-items-center rounded-lg text-maroon hover:bg-red-50"><Icon name="trash" className="size-5" /></button>
        </div>
        {err && <p className="text-xs text-maroon">{err}</p>}
      </td>
    </tr>
  );
}

export default function AreasManager() {
  const [areas, setAreas] = useState(null);
  const [form, setForm] = useState({ name: "", eta: 45, fee: 150 });
  const [err, setErr] = useState("");
  useEffect(() => { api("/api/admin/areas", "GET").then(setAreas).catch((e) => setErr(e.message)); }, []);

  return (
    <div>
      <h1 className="heading mb-2 text-4xl">Delivery areas</h1>
      <p className="mb-5 text-muted">These appear in the area dropdown customers see first. ETA is in minutes, fee in rupees. Untick “Active” to hide an area without deleting it.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try { const a = await api("/api/admin/areas", "POST", form); setAreas((l) => [...l, a].sort((x, y) => x.name.localeCompare(y.name))); setForm({ ...form, name: "" }); setErr(""); }
          catch (e2) { setErr(e2.message); }
        }}
        className="card mb-5 grid gap-3 p-4 sm:grid-cols-[1fr_120px_140px_auto] sm:items-end"
      >
        <label className="label">New area<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Madina Town" className="input" /></label>
        <label className="label">ETA (min)<input type="number" min={5} value={form.eta} onChange={(e) => setForm({ ...form, eta: e.target.value })} className="input" /></label>
        <label className="label">Fee (Rs.)<input type="number" min={0} value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="input" /></label>
        <button className="btn-maroon py-3"><Icon name="plus" className="size-5" />Add</button>
      </form>
      {err && <p className="mb-4 rounded-xl bg-red-50 p-3 text-maroon">{err}</p>}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-muted"><tr><th className="px-3 py-3">Area</th><th className="px-3 py-3">ETA</th><th className="px-3 py-3">Fee</th><th className="px-3 py-3 text-center">Active</th><th className="px-3 py-3" /></tr></thead>
          <tbody>
            {!areas && <tr><td colSpan={5} className="p-6 text-center text-muted">Loading…</td></tr>}
            {areas?.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted">No areas yet. Add one above or run <code>npm run seed</code>.</td></tr>}
            {areas?.map((a) => (
              <Row key={a.id} area={a} onSaved={(n) => setAreas((l) => l.map((x) => (x.id === n.id ? n : x)))} onDeleted={(id) => setAreas((l) => l.filter((x) => x.id !== id))} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
