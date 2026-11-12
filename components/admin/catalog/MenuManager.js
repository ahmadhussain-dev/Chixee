"use client";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/ui/Icon";
import { CATEGORIES, formatPKR } from "@/lib/menu";
import { api, ErrorNote, PhotoField, RowsSkeleton, Sheet, Switch, Thumb } from "@/components/admin/catalog/shared";

const EMPTY = { category: CATEGORIES[0].id, n: "", d: "", p: "", sizes: [], meal: false, flavours: [], tag: "", popular: false, img: "", active: true };

const priceText = (it) => (it.sizes?.length ? it.sizes.map((s) => `${s.name} ${formatPKR(s.price)}`).join(" · ") : formatPKR(it.p));

function ItemEditor({ item, onClose, onSaved, onDelete }) {
  const [v, setV] = useState(() => ({ ...EMPTY, ...item, p: item?.p ?? "", flavours: item?.flavours || [] }));
  const [mode, setMode] = useState(item?.sizes?.length ? "sizes" : "one");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setV({ ...v, [k]: e?.target ? (e.target.type === "checkbox" ? e.target.checked : e.target.value) : e });
  const glyph = CATEGORIES.find((c) => c.id === v.category)?.glyph;

  const setSize = (i, k, val) => setV({ ...v, sizes: v.sizes.map((s, j) => (j === i ? { ...s, [k]: val } : s)) });

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const body = {
      ...v,
      p: mode === "one" ? v.p : null,
      sizes: mode === "sizes" ? v.sizes : [],
      flavours: mode === "one" ? (typeof v.flavours === "string" ? v.flavours.split(",") : v.flavours) : [],
    };
    try {
      onSaved(item?.key ? await api(`/api/admin/menu/${item.key}`, "PATCH", body) : await api("/api/admin/menu", "POST", body), !item?.key);
    } catch (e2) {
      setErr(e2.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <Sheet title={item?.key ? `Edit ${item.n}` : "Add menu item"} onClose={onClose}
        footer={<div className="flex items-center justify-end gap-2">{item?.key && <button type="button" onClick={() => onDelete(item)} className="mr-auto rounded-full px-3 py-2.5 text-sm font-semibold text-maroon hover:bg-red-50">Delete</button>}<button type="button" onClick={onClose} className="rounded-full px-4 py-2.5 font-semibold text-muted hover:bg-cream">Cancel</button><button disabled={busy} className="btn-maroon px-6 py-2.5 disabled:opacity-50">{busy ? "Saving…" : "Save"}</button></div>}>
        <ErrorNote>{err}</ErrorNote>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">Category
            <select value={v.category} onChange={set("category")} className="input">{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </label>
          <label className="label">Name<input required value={v.n} onChange={set("n")} placeholder="e.g. Zinger Burger" className="input" /></label>
        </div>
        <label className="label">Description<input value={v.d} onChange={set("d")} placeholder="What's in it" className="input" /></label>

        <fieldset className="card grid gap-3 p-4">
          <legend className="sr-only">Price</legend>
          <div className="flex gap-2" role="radiogroup" aria-label="Price type">
            {[["one", "One price"], ["sizes", "Sizes"]].map(([m, l]) => (
              <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => { setMode(m); if (m === "sizes" && !v.sizes.length) setV({ ...v, sizes: [{ name: "Regular", price: "" }] }); }}
                className={`rounded-full px-4 py-2 text-sm font-bold ${mode === m ? "bg-maroon text-white" : "bg-cream text-ink"}`}>{l}</button>
            ))}
          </div>
          {mode === "one" ? (
            <>
              <label className="label max-w-[200px]">Price (Rs.)<input required type="number" inputMode="numeric" min={1} value={v.p} onChange={set("p")} className="input" /></label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.meal} onChange={set("meal")} className="size-5 accent-maroon" />Offer meal upgrades (+ fries, + fries &amp; drink)</label>
              <label className="label">Flavours <span className="font-normal text-muted">(optional, comma separated, same price)</span>
                <input value={Array.isArray(v.flavours) ? v.flavours.join(", ") : v.flavours} onChange={set("flavours")} placeholder="e.g. Coca-Cola, Sprite, Fanta" className="input" />
              </label>
            </>
          ) : (
            <div className="grid gap-2">
              {v.sizes.map((s, i) => (
                <div key={i} className="grid grid-cols-[1fr_120px_auto] gap-2">
                  <input aria-label="Size name" value={s.name} onChange={(e) => setSize(i, "name", e.target.value)} placeholder="Size, e.g. Large" className="input py-2" />
                  <input aria-label="Price" type="number" inputMode="numeric" min={1} value={s.price} onChange={(e) => setSize(i, "price", e.target.value)} placeholder="Rs." className="input py-2" />
                  <button type="button" aria-label="Remove size" onClick={() => setV({ ...v, sizes: v.sizes.filter((_, j) => j !== i) })} className="grid size-10 place-items-center rounded-lg text-maroon hover:bg-red-50"><Icon name="trash" className="size-5" /></button>
                </div>
              ))}
              <button type="button" onClick={() => setV({ ...v, sizes: [...v.sizes, { name: "", price: "" }] })} className="justify-self-start rounded-full px-3 py-2 text-sm font-bold text-maroon hover:bg-cream"><Icon name="plus" className="mr-1 inline size-4" />Add size</button>
            </div>
          )}
        </fieldset>

        <PhotoField value={v.img} onChange={set("img")} name={v.n} glyph={glyph} />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">Badge <span className="font-normal text-muted">(optional)</span><input value={v.tag} onChange={set("tag")} placeholder="e.g. New, Spicy" className="input" /></label>
          <div className="grid content-end gap-2 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={v.popular} onChange={set("popular")} className="size-5 accent-maroon" />Show in Popular items</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={v.active} onChange={set("active")} className="size-5 accent-maroon" />On the menu</label>
          </div>
        </div>
      </Sheet>
    </form>
  );
}

export default function MenuManager() {
  const [items, setItems] = useState(null);
  const [deals, setDeals] = useState([]);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null); // item, {} for new, or null
  const [err, setErr] = useState("");

  useEffect(() => {
    api("/api/admin/menu").then((d) => { setItems(d.items); setDeals(d.deals); }).catch((e) => setErr(e.message));
  }, []);

  const groups = useMemo(() => {
    if (!items) return [];
    const v = q.trim().toLowerCase();
    return CATEGORIES.filter((c) => cat === "all" || c.id === cat)
      .map((c) => ({ ...c, list: items.filter((i) => i.category === c.id && (!v || `${i.n} ${i.d}`.toLowerCase().includes(v))).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0)) }))
      .filter((g) => g.list.length || (!v && cat !== "all"));
  }, [items, cat, q]);

  const replace = (it) => setItems((l) => l.map((x) => (x.key === it.key ? it : x)));
  const toggle = async (it) => {
    replace({ ...it, active: !it.active });
    try { replace(await api(`/api/admin/menu/${it.key}`, "PATCH", { active: !it.active })); setErr(""); }
    catch (e) { replace(it); setErr(e.message); }
  };
  const remove = async (it) => {
    if (!confirm(`Delete ${it.n} from the menu? This can't be undone. To take it off for a while, switch it off instead.`)) return;
    try { await api(`/api/admin/menu/${it.key}`, "DELETE"); setItems((l) => l.filter((x) => x.key !== it.key)); setEditing(null); setErr(""); }
    catch (e) { setEditing(null); setErr(e.message); }
  };

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading text-3xl sm:text-4xl">Menu items</h1>
        <button type="button" onClick={() => setEditing({})} className="btn-maroon px-5 py-2.5"><Icon name="plus" className="size-5" />Add item</button>
      </div>
      <p className="mb-4 text-muted">Changes show on the website straight away. Switch an item off to hide it (sold out, seasonal); delete removes it for good.</p>

      <div className="mb-4 grid grid-cols-1 gap-3">
        <label className="relative">
          <span className="sr-only">Search items</span>
          <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items" className="input pl-11" />
        </label>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {[{ id: "all", name: "All" }, ...CATEGORIES].map((c) => (
            <button key={c.id} type="button" onClick={() => setCat(c.id)} aria-pressed={cat === c.id}
              className={`flex-none rounded-full px-4 py-2 text-sm font-semibold ${cat === c.id ? "bg-yellow text-maroon-dark" : "bg-white text-ink"}`}>{c.short || c.name}</button>
          ))}
        </div>
      </div>

      <ErrorNote>{err}</ErrorNote>
      {!items ? (
        !err && <RowsSkeleton label="Loading menu items" />
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5">
          {groups.map((g) => (
            <section key={g.id}>
              <h2 className="mb-2 font-bold">{g.name} <span className="font-normal text-muted">({g.list.length})</span></h2>
              {g.list.length ? (
                <ul className="card overflow-hidden">
                  {g.list.map((it) => {
                    const inDeals = deals.filter((d) => d.parts?.some((p) => p.item === it.key)).length;
                    return (
                      <li key={it.key} className={`flex items-center gap-3 border-t border-line p-3 first:border-t-0 ${it.active ? "" : "opacity-60"}`}>
                        <Thumb src={it.img} glyph={g.glyph} />
                        <button type="button" onClick={() => setEditing(it)} className="min-w-0 flex-1 text-left">
                          <b className="block truncate">{it.n}{it.tag && <span className="ml-2 rounded-full bg-yellow px-2 py-0.5 text-[11px] text-maroon-dark">{it.tag}</span>}</b>
                          <span className="block truncate text-sm text-muted">{priceText(it)}{it.meal ? " · meal upgrades" : ""}{inDeals ? ` · in ${inDeals} deal${inDeals > 1 ? "s" : ""}` : ""}{it.active ? "" : " · hidden"}</span>
                        </button>
                        <Switch checked={it.active} onChange={() => toggle(it)} label={`${it.n} on the menu`} />
                        <button type="button" onClick={() => setEditing(it)} aria-label={`Edit ${it.n}`} className="grid size-9 place-items-center rounded-lg text-ink hover:bg-cream"><Icon name="note" className="size-5" /></button>
                        <button type="button" onClick={() => remove(it)} aria-label={`Delete ${it.n}`} className="hidden size-9 place-items-center rounded-lg text-maroon hover:bg-red-50 sm:grid"><Icon name="trash" className="size-5" /></button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="card p-4 text-sm text-muted">No items in this category yet.</p>
              )}
            </section>
          ))}
          {!groups.length && <p className="card p-6 text-center text-muted">No items match “{q}”.</p>}
        </div>
      )}

      {editing && (
        <ItemEditor
          item={editing.key ? editing : { ...EMPTY, category: cat === "all" ? EMPTY.category : cat }}
          onClose={() => setEditing(null)}
          onDelete={remove}
          onSaved={(it, isNew) => { setItems((l) => (isNew ? [...l, it] : l.map((x) => (x.key === it.key ? it : x)))); setEditing(null); }}
        />
      )}
    </div>
  );
}
