"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useLocation } from "@/context/LocationContext";
import { CITIES, SITE } from "@/data/site";
import useScrollLock from "@/hooks/useScrollLock";

// Searchable area dropdown with ETA, like the reference design.
function AreaSelect({ areas, value, onChange, loading }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const boxRef = useRef(null);
  useEffect(() => {
    const close = (e) => boxRef.current && !boxRef.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const list = useMemo(() => {
    const v = q.trim().toLowerCase();
    return (areas || []).filter((a) => !v || a.name.toLowerCase().includes(v));
  }, [areas, q]);

  return (
    <div ref={boxRef} className="relative">
      <div className={`flex items-center rounded-xl border-[1.5px] bg-white transition ${open ? "border-yellow shadow-[0_0_0_3px_rgba(255,194,14,.25)]" : "border-line"}`}>
        <input
          id="area"
          role="combobox"
          aria-expanded={open}
          aria-controls="area-list"
          autoComplete="off"
          placeholder={loading ? "Loading areas…" : "Select Area / Sub Region"}
          value={open ? q : value?.name || ""}
          onFocus={() => { setOpen(true); setQ(""); }}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          className="min-w-0 flex-1 bg-transparent px-3.5 py-3 outline-none placeholder:text-[#a99a90]"
        />
        <button type="button" tabIndex={-1} aria-label="Show areas" onClick={() => setOpen((o) => !o)} className="m-1 grid size-10 place-items-center rounded-lg bg-cream text-muted">
          <Icon name="down" className={`size-4 transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <ul id="area-list" role="listbox" className="absolute inset-x-0 bottom-[calc(100%+6px)] z-10 max-h-72 animate-pop overflow-y-auto overscroll-contain rounded-xl bg-white py-1 shadow-[0_20px_50px_rgba(0,0,0,.2)] ring-1 ring-line">
          {!list.length && <li className="px-4 py-3 text-sm text-muted">{loading ? "Loading…" : "No area matches. Try another name or call us."}</li>}
          {list.map((a) => (
            <li key={a.id} role="option" aria-selected={value?.id === a.id}>
              <button
                type="button"
                onClick={() => { onChange(a); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-3 border-b border-line/70 px-4 py-3 text-left last:border-0 hover:bg-cream ${value?.id === a.id ? "bg-yellow-soft" : ""}`}
              >
                <span>{a.name}</span>
                <span className="flex-none text-sm text-muted">~ eta {a.eta} min.</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LocationModal() {
  const { location, ready, modalOpen, setModalOpen, setLocation } = useLocation();
  const pathname = usePathname();
  // First-time visitors see the popup on the home page; auth and other pages stay usable.
  const firstVisit = ready && !location && pathname === "/";
  const open = modalOpen || firstVisit;

  const close = () => {
    if (firstVisit) setLocation({ type: "delivery", city: CITIES[0], area: null }); // let people browse without choosing
    setModalOpen(false);
  };

  // While open: the page behind stays still, Escape closes, and a tap outside the box closes.
  useScrollLock(open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && close();
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loc-title"
      aria-hidden={!open}
      className={`fixed inset-0 z-[85] grid place-items-center bg-night/55 p-4 backdrop-blur-[2px] transition-all duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div className={`relative w-[min(520px,100%)] rounded-3xl bg-white p-6 shadow-[0_30px_70px_rgba(0,0,0,.3)] transition-transform duration-500 ease-brand sm:p-8 ${open ? "translate-y-0" : "translate-y-8 scale-[.96]"}`}>
        <button type="button" aria-label="Close" onClick={close} className="absolute right-3.5 top-3.5 grid size-10 place-items-center rounded-[10px] transition duration-300 hover:rotate-90 hover:bg-cream">
          <Icon name="x" className="size-[22px]" />
        </button>
        {/* Remount the form each time the popup opens so it starts from the saved choice */}
        {open && <LocationForm key="form" onDone={() => setModalOpen(false)} />}
      </div>
    </div>
  );
}

function LocationForm({ onDone }) {
  const { location, setLocation, areas, loadAreas } = useLocation();
  const [type, setType] = useState(location?.type || "delivery");
  const [city, setCity] = useState(location?.city || CITIES[0]);
  const [area, setArea] = useState(location?.area || null);
  const loading = areas === null;

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  const canSubmit = type === "pickup" || !!area;
  const submit = () => {
    if (!canSubmit) return;
    setLocation({ type, city, area: type === "delivery" ? area : null });
    onDone();
  };

  return (
    <>
        <div className="flex justify-center"><Logo size={72} /></div>

        <h2 id="loc-title" className="mt-4 text-center text-lg font-semibold">Select your order type</h2>
        <div className="mt-3 flex justify-center gap-3">
          {[["delivery", "Delivery"], ["pickup", "Pick-Up"]].map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={type === k}
              onClick={() => setType(k)}
              className={`rounded-full px-7 py-3 font-semibold transition ${type === k ? "bg-maroon text-white shadow-[0_6px_14px_rgba(163,22,27,.3)]" : "border-2 border-line text-ink hover:border-maroon"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {type === "delivery" ? (
          <div className="mt-6 grid gap-4">
            <p className="text-center font-semibold">Please select your location</p>
            <label className="label" htmlFor="city">
              Select City / Region
              <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="input appearance-none">
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <div className="label">
              <label htmlFor="area">Select Area / Sub Region</label>
              <AreaSelect areas={(areas || []).filter((a) => a.city === city)} value={area} onChange={setArea} loading={loading} />
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-yellow-soft p-4 text-maroon-dark">
            <Icon name="store" className="mt-0.5 size-6 flex-none" />
            <div>
              <b className="block">{SITE.branch.name} branch</b>
              <span className="text-sm">{SITE.branch.address}</span>
            </div>
          </div>
        )}

        <button type="button" disabled={!canSubmit} onClick={submit} className="btn-yellow mt-6 w-full py-3.5 text-base disabled:bg-[#ccc] disabled:text-[#888] disabled:shadow-none">
          Select
        </button>
    </>
  );
}
