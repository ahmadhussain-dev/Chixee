"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { MENU, ITEMS } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import useFooterGap from "@/hooks/useFooterGap";

const smooth = () => (matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth");

// Floating "back to top" button, shown once the category bar is stuck. Sits above the cart button when that is visible.
function BackToTop({ show }) {
  const { count } = useCart();
  const footerGap = useFooterGap();
  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      style={{ marginBottom: footerGap }}
      onClick={() => window.scrollTo({ top: 0, behavior: smooth() })}
      className={`fixed right-[max(16px,env(safe-area-inset-right))] z-[55] grid size-12 place-items-center rounded-full bg-white text-maroon shadow-[0_10px_26px_rgba(34,20,15,.18)] ring-1 ring-line transition-all duration-500 ease-brand hover:-translate-y-0.5 hover:bg-yellow sm:right-[max(20px,env(safe-area-inset-right))] ${count ? "bottom-[88px] sm:bottom-[96px]" : "bottom-[max(16px,env(safe-area-inset-bottom))] sm:bottom-5"} ${show ? "visible opacity-100" : "invisible translate-y-6 opacity-0"}`}
    >
      <Icon name="left" className="size-5 rotate-90" strokeWidth={2.4} />
    </button>
  );
}

export default function MenuBrowser() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(MENU[0].id);
  const [ink, setInk] = useState({ x: 0, w: 0 });
  const [stuck, setStuck] = useState(false);
  const [railSearch, setRailSearch] = useState(false);
  const tabsRef = useRef(null);
  const sentinelRef = useRef(null);
  const railInputRef = useRef(null);
  const menuTopRef = useRef(null);

  const sections = useMemo(() => {
    const v = q.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      list: ITEMS.filter((i) => i.category === c.id && (!v || `${i.n} ${i.d} ${c.name}`.toLowerCase().includes(v))),
    }));
  }, [q]);
  const anyMatch = sections.some((s) => s.list.length);

  // "Stuck" = the category bar has reached the top of the screen.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const isStuck = !e.isIntersecting && e.boundingClientRect.top < 0;
      setStuck(isStuck);
      if (!isStuck) setRailSearch(false);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scrollspy: highlight the category currently under the sticky bar.
  useEffect(() => {
    const spy = () => {
      let id = MENU[0].id;
      for (const c of MENU) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top - 120 <= 0) id = c.id;
      }
      setActive(id);
    };
    spy();
    addEventListener("scroll", spy, { passive: true });
    return () => removeEventListener("scroll", spy);
  }, [q]);

  // Sliding yellow ink under the active tab.
  useLayoutEffect(() => {
    const place = () => {
      const b = tabsRef.current?.querySelector(`[data-target="${active}"]`);
      if (!b) return;
      setInk({ x: b.offsetLeft, w: b.offsetWidth });
      tabsRef.current.scrollTo({ left: b.offsetLeft - tabsRef.current.clientWidth / 2 + b.offsetWidth / 2, behavior: "smooth" });
    };
    place();
    addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => removeEventListener("resize", place);
  }, [active, railSearch]);

  useEffect(() => {
    if (railSearch) railInputRef.current?.focus();
  }, [railSearch]);

  // While searching from the sticky bar, jump to the top of the results (the bar stays stuck just above them).
  useEffect(() => {
    if (!railSearch || !sentinelRef.current) return;
    const y = sentinelRef.current.getBoundingClientRect().top + window.scrollY + 2;
    window.scrollTo({ top: y, behavior: "auto" });
  }, [q, railSearch]);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <nav aria-label="Menu categories" className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_var(--color-line),0_8px_24px_rgba(34,20,15,.05)] backdrop-blur-md">
        <div className="wrap flex items-center gap-2">
          {stuck && !railSearch && (
            <button type="button" onClick={() => setRailSearch(true)} aria-label="Search the menu"
              className="grid size-10 flex-none animate-pop place-items-center rounded-xl bg-cream text-maroon ring-1 ring-line transition hover:bg-yellow">
              <Icon name="search" className="size-5" />
            </button>
          )}

          {railSearch ? (
            <div className="flex min-w-0 flex-1 animate-pop items-center gap-2 py-2.5">
              <label htmlFor="rail-q" className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-cream px-3 ring-1 ring-line focus-within:ring-2 focus-within:ring-yellow">
                <Icon name="search" className="size-5 flex-none text-muted" />
                <span className="sr-only">Search the menu</span>
                <input id="rail-q" ref={railInputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search broast, pizza, chai…" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-2.5 text-base outline-none placeholder:text-[#a99a90]" />
              </label>
              <button type="button" onClick={() => setRailSearch(false)} aria-label="Close search" className="grid size-10 flex-none place-items-center rounded-xl text-muted hover:bg-cream hover:text-maroon">
                <Icon name="x" className="size-5" />
              </button>
            </div>
          ) : (
            <div ref={tabsRef} className="no-scrollbar relative flex min-w-0 flex-1 gap-1 overflow-x-auto py-3 sm:gap-1.5">
              <span aria-hidden="true" style={{ transform: `translateX(${ink.x}px)`, width: ink.w }}
                className="absolute left-0 top-3 z-0 h-[calc(100%-24px)] rounded-xl bg-yellow shadow-[0_6px_16px_rgba(242,174,0,.35)] transition-[transform,width] duration-500 ease-brand" />
              {sections.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  data-target={c.id}
                  onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: smooth() })}
                  style={{ opacity: c.list.length ? 1 : 0.35 }}
                  className={`relative z-[1] flex-none whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[13px] font-semibold uppercase tracking-[.6px] transition-colors hover:text-maroon sm:px-5 sm:text-sm ${active === c.id ? "text-maroon-dark" : "text-ink"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>
      <BackToTop show={stuck} />

      <div className="wrap" id="menu" ref={menuTopRef}>
        <label htmlFor="q" className="mt-5 flex items-center gap-3 rounded-[14px] bg-white py-1 pl-4 pr-1 shadow-[0_0_0_1px_var(--color-line)] transition focus-within:shadow-[0_0_0_2px_var(--color-yellow),0_10px_26px_rgba(242,174,0,.18)] sm:mt-7 sm:pl-[18px]">
          <Icon name="search" className="size-[22px] flex-none text-muted" />
          <span className="sr-only">Search the menu</span>
          <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for broast, pizza, chai…" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-[#a99a90]" />
          {q && <button type="button" onClick={() => setQ("")} className="rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-muted hover:bg-cream hover:text-maroon">Clear</button>}
        </label>

        {sections.map((c) =>
          c.list.length ? (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-[72px] pt-9 sm:scroll-mt-[86px] sm:pt-14">
              <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 sm:mb-6">
                <h2 id={`${c.id}-h`} className="heading text-[clamp(28px,3.4vw,42px)] after:mt-3 after:block after:h-[5px] after:w-[90px] after:rounded after:bg-yellow">
                  <small className="mb-0.5 block font-script text-2xl text-maroon">{c.script}</small>
                  {c.name}
                </h2>
                {c.note && <p className="max-w-[46ch] text-sm text-muted">{c.note}</p>}
              </div>
              <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-[22px]">
                {c.list.map((item) => <MenuItemCard key={item.id} item={item} />)}
              </div>
            </section>
          ) : null
        )}
        {!anyMatch && (
          <div className="pb-5 pt-16 text-center text-muted">
            <b className="block font-display text-[28px] font-normal text-ink">Nothing matches that</b>
            Try “broast”, “wrap” or “chai”.
          </div>
        )}
      </div>
    </>
  );
}
