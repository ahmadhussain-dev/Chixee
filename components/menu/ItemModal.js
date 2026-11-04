"use client";
import { useEffect, useRef, useState } from "react";
import ItemThumb from "@/components/menu/ItemThumb";
import Icon from "@/components/ui/Icon";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { IF_UNAVAILABLE, defaultSize, formatPKR, frequentlyBoughtWith, fromPrice, priceOf } from "@/data/menu";

const SHOW_FIRST = 3;
const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

function Badge({ done, children }) {
  return (
    <span className={`flex-none rounded-full px-3 py-1 text-xs font-bold ${done ? "bg-ink/10 text-ink" : "bg-maroon text-white"}`}>
      {done ? <><Icon name="check" className="-mt-0.5 mr-1 inline size-3.5" />Done</> : children}
    </span>
  );
}

// Item popup: photo, details, variation, frequently bought together, notes, quantity, add to cart.
export default function ItemModal({ item, onClose }) {
  const { add } = useCart();
  const toast = useToast();
  const options = item.sizes ? Object.entries(item.sizes) : null;
  const [variation, setVariation] = useState(options?.length === 1 ? options[0][0] : null);
  const [extras, setExtras] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [note, setNote] = useState("");
  const [ifUnavailable, setIfUnavailable] = useState("remove");
  const [qty, setQty] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [nudge, setNudge] = useState(0);
  const scrollRef = useRef(null);
  const variationRef = useRef(null);
  const nextRef = useRef(null);
  const closeRef = useRef(null);

  const suggestions = frequentlyBoughtWith(item);
  const shown = showAll ? suggestions : suggestions.slice(0, SHOW_FIRST);
  const needsVariation = options && !variation;
  const unit = options ? (variation ? item.sizes[variation] : fromPrice(item)) : item.p;
  const extrasTotal = extras.reduce((s, id) => s + priceOf(suggestions.find((x) => x.id === id), defaultSize(suggestions.find((x) => x.id === id))), 0);
  const total = unit * qty + extrasTotal;

  // Close on Escape, lock page scroll while open, focus the close button for keyboard users.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [onClose]);

  // Scroll only the popup's own content (scrollIntoView would also shift the popup frame).
  const scrollToSection = (el) => {
    const sc = scrollRef.current;
    if (!sc || !el) return;
    const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 68;
    sc.scrollTo({ top, behavior: smooth() });
  };

  const choose = (name) => {
    setVariation(name);
    // Move on to the next section once a variation is picked.
    requestAnimationFrame(() => scrollToSection(nextRef.current));
  };

  const toggleExtra = (id) => setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  const submit = () => {
    if (needsVariation) {
      scrollToSection(variationRef.current);
      setNudge((n) => n + 1);
      return;
    }
    add(item.id, variation, qty, { note, ifUnavailable });
    for (const id of extras) {
      const x = suggestions.find((s) => s.id === id);
      add(x.id, defaultSize(x), 1);
    }
    toast(`${qty} × ${item.n}${variation && options.length > 1 ? ` (${variation})` : ""} added to cart`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" role="presentation">
      <button type="button" aria-label="Close" tabIndex={-1} onClick={onClose} className="absolute inset-0 animate-[fade_.25s_ease] bg-night/55 backdrop-blur-[2px]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
        className="relative flex max-h-[92dvh] w-full animate-[sheet_.4s_var(--ease-brand)] flex-col overflow-clip rounded-t-[26px] bg-white shadow-[0_30px_80px_rgba(0,0,0,.35)] sm:max-w-[560px] sm:animate-pop sm:rounded-[26px]"
      >
        {/* Header bar: the item name appears once the photo scrolls away */}
        <div className={`absolute inset-x-0 top-0 z-10 flex items-center gap-3 px-4 py-3 transition-colors duration-300 sm:px-5 ${scrolled ? "border-b border-line bg-white" : ""}`}>
          <b className={`min-w-0 flex-1 truncate text-lg transition-opacity duration-300 ${scrolled ? "opacity-100" : "opacity-0"}`} aria-hidden={!scrolled}>{item.n}</b>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="grid size-10 flex-none place-items-center rounded-full bg-white text-ink shadow-[0_4px_14px_rgba(0,0,0,.15)] ring-1 ring-line transition hover:bg-yellow">
            <Icon name="x" className="size-5" />
          </button>
        </div>

        <div ref={scrollRef} onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 160)} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative aspect-[16/10] bg-yellow">
            <div className="absolute inset-3 sm:inset-5">
              <ItemThumb item={item} sizes="(max-width: 640px) 100vw, 560px" />
            </div>
          </div>

          <div className="grid gap-6 px-5 pb-6 pt-5 sm:px-6">
            <div>
              {item.tag && <span className="mb-1.5 inline-block rounded-full bg-maroon px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[.6px] text-yellow">{item.tag}</span>}
              <h2 id="item-modal-title" className="text-2xl font-bold leading-tight">{item.n}</h2>
              <p className="mt-2 text-xl font-bold tabular-nums">{options && options.length > 1 && !variation ? <><span className="text-base font-semibold text-muted">from </span>{formatPKR(fromPrice(item))}</> : formatPKR(unit)}{item.was && <s className="ml-2 text-base font-medium text-muted">{formatPKR(item.was)}</s>}</p>
              {item.d && <p className="mt-2 leading-relaxed text-muted">{item.d}</p>}
            </div>

            {options && options.length > 1 && (
              <fieldset ref={variationRef} key={nudge} className={`scroll-mt-16 rounded-2xl bg-yellow-soft p-4 ring-1 ring-yellow/60 sm:p-5 ${nudge ? "animate-[shake_.4s_ease]" : ""}`}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <legend className="contents">
                    <span>
                      <b className="block text-lg">Variation</b>
                      <span className="text-sm text-muted">{item.variationLabel || "Select 1"} · Select 1</span>
                    </span>
                  </legend>
                  <Badge done={!!variation}>Required</Badge>
                </div>
                <div className="grid gap-1">
                  {options.map(([name, price]) => (
                    <label key={name} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition ${variation === name ? "bg-yellow/70" : "hover:bg-yellow/35"}`}>
                      <span className="min-w-0 flex-1 font-medium">{name}</span>
                      <span className="tabular-nums text-ink/80">{formatPKR(price)}</span>
                      <input type="radio" name="variation" value={name} checked={variation === name} onChange={() => choose(name)} className="peer sr-only" />
                      <span aria-hidden="true" className={`grid size-[22px] flex-none place-items-center rounded-full border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-maroon ${variation === name ? "border-maroon" : "border-ink/40"}`}>
                        {variation === name && <span className="size-2.5 rounded-full bg-maroon" />}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div ref={nextRef} className="grid gap-6">
              {!!suggestions.length && (
                <section aria-labelledby="fbt-h">
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <div>
                      <h3 id="fbt-h" className="text-lg font-bold">Frequently bought together</h3>
                      <p className="text-sm text-muted">Others around you liked this</p>
                    </div>
                    <span className="flex-none rounded-full bg-cream px-3 py-1 text-xs font-bold text-muted ring-1 ring-line">Optional</span>
                  </div>
                  <ul className="mt-2 grid gap-1">
                    {shown.map((x) => {
                      const size = defaultSize(x);
                      const on = extras.includes(x.id);
                      return (
                        <li key={x.id}>
                          <label className={`flex cursor-pointer items-center gap-3 rounded-xl p-2 transition ${on ? "bg-yellow-soft" : "hover:bg-cream"}`}>
                            <span className="relative size-14 flex-none overflow-hidden rounded-xl bg-yellow"><ItemThumb item={x} small sizes="56px" /></span>
                            <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug">{x.n}{size && Object.keys(x.sizes).length > 1 ? ` (${size})` : ""}</span>
                            <span className="flex-none text-sm tabular-nums text-ink/80">+ {formatPKR(priceOf(x, size))}</span>
                            <input type="checkbox" checked={on} onChange={() => toggleExtra(x.id)} className="peer sr-only" />
                            <span aria-hidden="true" className={`grid size-[22px] flex-none place-items-center rounded-md border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-maroon ${on ? "border-maroon bg-maroon text-white" : "border-ink/40"}`}>
                              {on && <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  {suggestions.length > SHOW_FIRST && (
                    <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-1 flex items-center gap-2 rounded-lg px-2 py-2 text-[15px] font-semibold text-ink hover:text-maroon">
                      <Icon name="down" className={`size-4 transition ${showAll ? "rotate-180" : ""}`} />
                      {showAll ? "View less" : `View ${suggestions.length - SHOW_FIRST} more`}
                    </button>
                  )}
                </section>
              )}

              <div className="grid gap-2 border-t border-line pt-5">
                <label htmlFor="item-note" className="text-lg font-bold">Special instructions</label>
                <p className="-mt-1.5 text-sm text-muted">Special requests are subject to the restaurant&apos;s approval. Tell us here!</p>
                <textarea id="item-note" value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} rows={3} placeholder="e.g. No mayo, extra spicy" className="input resize-none" />
              </div>

              <fieldset className="grid gap-2">
                <legend className="mb-2 text-lg font-bold">If this item is not available</legend>
                <div className="grid gap-1.5" role="radiogroup">
                  {Object.entries(IF_UNAVAILABLE).map(([k, v]) => (
                    <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] ring-1 transition ${ifUnavailable === k ? "bg-yellow-soft font-semibold ring-yellow" : "ring-line hover:bg-cream"}`}>
                      <input type="radio" name="if-unavailable" value={k} checked={ifUnavailable === k} onChange={() => setIfUnavailable(k)} className="peer sr-only" />
                      <span aria-hidden="true" className={`grid size-5 flex-none place-items-center rounded-full border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-maroon ${ifUnavailable === k ? "border-maroon" : "border-ink/40"}`}>
                        {ifUnavailable === k && <span className="size-2 rounded-full bg-maroon" />}
                      </span>
                      {v}
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 border-t border-line bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:gap-4 sm:px-5 sm:py-4">
          <div className="flex flex-none items-center gap-2.5">
            <button type="button" aria-label="Remove one" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-10 place-items-center rounded-full text-xl ring-1 ring-line transition hover:bg-cream disabled:bg-cream disabled:text-ink/30">−</button>
            <output aria-live="polite" className="min-w-5 text-center font-bold tabular-nums">{qty}</output>
            <button type="button" aria-label="Add one" disabled={qty >= 50} onClick={() => setQty((q) => Math.min(50, q + 1))} className="grid size-10 place-items-center rounded-full text-xl ring-1 ring-line transition hover:bg-cream">+</button>
          </div>
          <button
            type="button"
            onClick={submit}
            aria-disabled={needsVariation}
            className={`flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl px-4 font-bold transition ${needsVariation ? "bg-[#c9c3bf] text-white" : "bg-maroon text-white shadow-[0_10px_24px_rgba(140,22,29,.3)] hover:bg-maroon-dark"}`}
          >
            {needsVariation ? "Choose a variation" : <>Add to cart <span className="font-semibold opacity-80">· {formatPKR(total)}</span></>}
          </button>
        </div>
      </div>
    </div>
  );
}
