"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { MENU, ITEMS } from "@/data/menu";

export default function MenuBrowser() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(MENU[0].id);
  const [ink, setInk] = useState({ x: 0, w: 0 });
  const tabsRef = useRef(null);

  const sections = useMemo(() => {
    const v = q.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      list: ITEMS.filter((i) => i.category === c.id && (!v || `${i.n} ${i.d} ${c.name}`.toLowerCase().includes(v))),
    }));
  }, [q]);
  const anyMatch = sections.some((s) => s.list.length);

  // Scrollspy: highlight the category currently under the sticky rail.
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
  }, [active]);

  return (
    <>
      <nav aria-label="Menu categories" className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_var(--color-line),0_8px_24px_rgba(34,20,15,.05)] backdrop-blur-md">
        <div className="wrap">
          <div ref={tabsRef} className="no-scrollbar relative flex gap-1.5 overflow-x-auto py-3">
            <span aria-hidden="true" style={{ transform: `translateX(${ink.x}px)`, width: ink.w }}
              className="absolute left-0 top-3 z-0 h-[calc(100%-24px)] rounded-xl bg-yellow shadow-[0_6px_16px_rgba(242,174,0,.35)] transition-[transform,width] duration-500 ease-brand" />
            {sections.map((c) => (
              <button
                key={c.id}
                type="button"
                data-target={c.id}
                onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth" })}
                style={{ opacity: c.list.length ? 1 : 0.35 }}
                className={`relative z-[1] flex-none whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold uppercase tracking-[.6px] transition-colors hover:text-maroon ${active === c.id ? "text-maroon-dark" : "text-ink"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="wrap" id="menu">
        <label htmlFor="q" className="mt-7 flex items-center gap-3 rounded-[14px] bg-white py-1 pl-[18px] pr-1 shadow-[0_0_0_1px_var(--color-line)] transition focus-within:shadow-[0_0_0_2px_var(--color-yellow),0_10px_26px_rgba(242,174,0,.18)]">
          <Icon name="search" className="size-[22px] flex-none text-muted" />
          <span className="sr-only">Search the menu</span>
          <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for broast, pizza, chai…" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-[#a99a90]" />
          {q && <button type="button" onClick={() => setQ("")} className="rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-muted hover:bg-cream hover:text-maroon">Clear</button>}
        </label>

        {sections.map((c) =>
          c.list.length ? (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-[86px] pt-10 sm:pt-14">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <h2 id={`${c.id}-h`} className="heading text-[clamp(30px,3.4vw,42px)] after:mt-3 after:block after:h-[5px] after:w-[90px] after:rounded after:bg-yellow">
                  <small className="mb-0.5 block font-script text-2xl text-maroon">{c.script}</small>
                  {c.name}
                </h2>
                {c.note && <p className="max-w-[46ch] text-sm text-muted">{c.note}</p>}
              </div>
              <div className="grid gap-3.5 sm:grid-cols-2 sm:gap-[22px] xl:grid-cols-3">
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
