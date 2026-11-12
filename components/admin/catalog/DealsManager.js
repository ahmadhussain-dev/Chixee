"use client";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { CATEGORIES, DEAL_GROUP_META, formatPKR } from "@/lib/menu";
import { api, ErrorNote, PhotoField, RowsSkeleton, Sheet, Switch, Thumb } from "@/components/admin/catalog/shared";

const EMPTY = { group: DEAL_GROUP_META[0].id, n: "", p: "", serves: 1, when: "", badge: "", featured: false, img: "", parts: [], active: true };

// Menu price of one part (size price, or the single price).
const partPrice = (item, size) => (item?.sizes?.length ? (item.sizes.find((s) => s.name === size) || item.sizes[0]).price : item?.p || 0);

function DealEditor({ deal, items, onClose, onSaved, onDelete }) {
  const [v, setV] = useState(() => ({ ...EMPTY, ...deal }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const byKey = useMemo(() => Object.fromEntries(items.map((i) => [i.key, i])), [items]);
  const set = (k) => (e) => setV({ ...v, [k]: e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e });
  const setPart = (i, patch) => setV({ ...v, parts: v.parts.map((p, j) => (j === i ? { ...p, ...patch } : p)) });
  const menuTotal = v.parts.reduce((s, p) => s + partPrice(byKey[p.item], p.size) * (Number(p.qty) || 1), 0);
  const saving = menuTotal - (Number(v.p) || 0);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      onSaved(deal?.key ? await api(`/api/admin/deals/${deal.key}`, "PATCH", v) : await api("/api/admin/deals", "POST", v), !deal?.key);
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <Sheet title={deal?.key ? `Edit ${deal.n}` : "Add deal"} onClose={onClose}
        footer={<div className="flex items-center justify-end gap-2">{deal?.key && <button type="button" onClick={() => onDelete(deal)} className="mr-auto rounded-full px-3 py-2.5 text-sm font-semibold text-maroon hover:bg-red-50">Delete</button>}<button type="button" onClick={onClose} className="rounded-full px-4 py-2.5 font-semibold text-muted hover:bg-cream">Cancel</button><button disabled={busy} className="btn-maroon px-6 py-2.5 disabled:opacity-50">{busy ? "Saving…" : "Save"}</button></div>}>
        <ErrorNote>{err}</ErrorNote>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">Name<input required value={v.n} onChange={set("n")} placeholder="e.g. Family Broast Feast" className="input" /></label>
          <label className="label">Section
            <select value={v.group} onChange={set("group")} className="input">{DEAL_GROUP_META.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select>
          </label>
        </div>

        <fieldset className="card grid gap-2 p-4">
          <legend className="sr-only">What&apos;s in the deal</legend>
          <b className="text-sm">What&apos;s in the deal</b>
          {v.parts.map((p, i) => {
            const it = byKey[p.item];
            return (
              <div key={i} className="grid grid-cols-[64px_1fr_auto] gap-2 sm:grid-cols-[64px_1fr_140px_auto]">
                <input aria-label="Quantity" type="number" inputMode="numeric" min={1} max={20} value={p.qty} onChange={(e) => setPart(i, { qty: e.target.value })} className="input px-2 py-2 text-center" />
                <select aria-label="Menu item" value={p.item} onChange={(e) => setPart(i, { item: e.target.value, size: byKey[e.target.value]?.sizes?.[0]?.name || "" })} className="input py-2">
                  {CATEGORIES.map((c) => (
                    <optgroup key={c.id} label={c.name}>
                      {items.filter((x) => x.category === c.id).map((x) => <option key={x.key} value={x.key}>{x.n}{x.active ? "" : " (hidden)"}</option>)}
                    </optgroup>
                  ))}
                </select>
                {it?.sizes?.length ? (
                  <select aria-label="Size" value={p.size} onChange={(e) => setPart(i, { size: e.target.value })} className="input col-span-2 col-start-2 row-start-2 py-2 sm:col-span-1 sm:col-start-auto sm:row-start-auto">
                    {it.sizes.map((s) => <option key={s.name}>{s.name}</option>)}
                  </select>
                ) : <span className="hidden sm:block" />}
                <button type="button" aria-label="Remove" onClick={() => setV({ ...v, parts: v.parts.filter((_, j) => j !== i) })} className="col-start-3 row-start-1 grid size-10 place-items-center rounded-lg text-maroon hover:bg-red-50 sm:col-start-auto sm:row-start-auto"><Icon name="trash" className="size-5" /></button>
              </div>
            );
          })}
          <button type="button" disabled={!items.length} onClick={() => setV({ ...v, parts: [...v.parts, { item: items[0].key, qty: 1, size: items[0].sizes?.[0]?.name || "" }] })}
            className="justify-self-start rounded-full px-3 py-2 text-sm font-bold text-maroon hover:bg-cream"><Icon name="plus" className="mr-1 inline size-4" />Add item</button>
          {menuTotal > 0 && <p className="text-sm text-muted">Menu price of these items: <b className="text-ink">{formatPKR(menuTotal)}</b>{saving > 0 ? ` · customer saves ${formatPKR(saving)}` : ""}</p>}
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <label className="label">Deal price (Rs.)<input required type="number" inputMode="numeric" min={1} value={v.p} onChange={set("p")} className="input" /></label>
          <label className="label">Serves<input type="number" inputMode="numeric" min={1} max={50} value={v.serves} onChange={set("serves")} className="input" /></label>
          <label className="label">Badge <span className="font-normal text-muted">(optional)</span><input value={v.badge} onChange={set("badge")} placeholder="e.g. Today only" className="input" /></label>
          <label className="label">When <span className="font-normal text-muted">(optional)</span><input value={v.when} onChange={set("when")} placeholder="e.g. Every Monday" className="input" /></label>
        </div>

        <PhotoField value={v.img} onChange={set("img")} name={v.n} glyph="tag" />
        <p className="-mt-2 text-xs text-muted">No photo? The card shows the photos of the items inside the deal.</p>

        <div className="grid gap-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={v.featured} onChange={set("featured")} className="size-5 accent-maroon" />Featured (big slider on the Deals page, first in Hot Deals)</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={v.active} onChange={set("active")} className="size-5 accent-maroon" />On the website</label>
        </div>
      </Sheet>
    </form>
  );
}

export default function DealsManager() {
  const [data, setData] = useState(null);
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => { api("/api/admin/menu").then(setData).catch((e) => setErr(e.message)); }, []);

  const byKey = useMemo(() => Object.fromEntries((data?.items || []).map((i) => [i.key, i])), [data]);
  const setDeals = (fn) => setData((d) => ({ ...d, deals: fn(d.deals) }));
  const replace = (deal) => setDeals((l) => l.map((x) => (x.key === deal.key ? deal : x)));

  const toggle = async (deal) => {
    replace({ ...deal, active: !deal.active });
    try { replace(await api(`/api/admin/deals/${deal.key}`, "PATCH", { active: !deal.active })); setErr(""); }
    catch (e) { replace(deal); setErr(e.message); }
  };
  const remove = async (deal) => {
    if (!confirm(`Delete the deal “${deal.n}”? This can't be undone. To pause it, switch it off instead.`)) return;
    try { await api(`/api/admin/deals/${deal.key}`, "DELETE"); setDeals((l) => l.filter((x) => x.key !== deal.key)); setEditing(null); setErr(""); }
    catch (e) { setEditing(null); setErr(e.message); }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading text-3xl sm:text-4xl">Deals</h1>
        <button type="button" disabled={!data} onClick={() => setEditing({})} className="btn-maroon px-5 py-2.5 disabled:opacity-50"><Icon name="plus" className="size-5" />Add deal</button>
      </div>
      <p className="mb-4 text-muted">Deals are built from menu items, so the “was” price updates when menu prices change. Switch a deal off to pause it.</p>
      <ErrorNote>{err}</ErrorNote>
      {!data ? (
        !err && <RowsSkeleton label="Loading deals" />
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5">
          {DEAL_GROUP_META.map((g) => {
            const list = data.deals.filter((d) => d.group === g.id).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
            return (
              <section key={g.id}>
                <h2 className="mb-2 font-bold">{g.name} <span className="font-normal text-muted">({list.length})</span></h2>
                {list.length ? (
                  <ul className="card overflow-hidden">
                    {list.map((d) => {
                      const missing = d.parts.filter((p) => !byKey[p.item] || !byKey[p.item].active).length;
                      return (
                        <li key={d.key} className={`flex items-center gap-3 border-t border-line p-3 first:border-t-0 ${d.active ? "" : "opacity-60"}`}>
                          <Thumb src={d.img || byKey[d.parts[0]?.item]?.img} glyph="tag" />
                          <button type="button" onClick={() => setEditing(d)} className="min-w-0 flex-1 text-left">
                            <b className="block truncate">{d.n}{d.featured && <span className="ml-2 rounded-full bg-yellow px-2 py-0.5 text-[11px] text-maroon-dark">Featured</span>}</b>
                            <span className="block truncate text-sm text-muted">
                              {formatPKR(d.p)} · {d.parts.map((p) => `${p.qty > 1 ? `${p.qty}× ` : ""}${byKey[p.item]?.n || "removed item"}`).join(", ")}
                            </span>
                            {missing > 0 && <span className="block text-xs font-semibold text-maroon">{missing} item{missing > 1 ? "s are" : " is"} hidden or removed from the menu</span>}
                          </button>
                          <Switch checked={d.active} onChange={() => toggle(d)} label={`${d.n} on the website`} />
                          <button type="button" onClick={() => setEditing(d)} aria-label={`Edit ${d.n}`} className="grid size-9 place-items-center rounded-lg hover:bg-cream"><Icon name="note" className="size-5" /></button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="card p-4 text-sm text-muted">No deals in this section. Sections without deals are hidden on the website.</p>
                )}
              </section>
            );
          })}
        </div>
      )}
      {editing && data && (
        <DealEditor
          deal={editing.key ? editing : null}
          items={data.items}
          onClose={() => setEditing(null)}
          onDelete={remove}
          onSaved={(d, isNew) => { setDeals((l) => (isNew ? [...l, d] : l.map((x) => (x.key === d.key ? d : x)))); setEditing(null); }}
        />
      )}
    </div>
  );
}
