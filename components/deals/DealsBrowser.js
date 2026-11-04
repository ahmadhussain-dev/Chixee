"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import DealMiniCard from "@/components/deals/DealMiniCard";
import DealsHero from "@/components/deals/DealsHero";
import MenuItemCard from "@/components/menu/MenuItemCard";
import Icon from "@/components/ui/Icon";
import { BackToTop, SearchButton, smooth } from "@/components/ui/FloatingButtons";
import { DEAL_GROUPS, DEALS } from "@/data/menu";

const GROUPS = DEAL_GROUPS.map((g) => ({ ...g, list: DEALS.filter((d) => d.group === g.id) })).filter((g) => g.list.length);
const FEATURED = DEALS.filter((d) => d.featured);
const SLIDES = FEATURED.length ? FEATURED : DEALS.slice(0, 3);
// Two quick deals beside the big carousel on wide screens (ones not already in it).
const SIDE = DEALS.filter((d) => !SLIDES.includes(d)).slice(0, 2);

// /deals: big carousel, then sticky category chips (Today's, Weekly, ...) and a grid of deal cards per group.
export default function DealsBrowser() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(GROUPS[0]?.id);
  const searchRef = useRef(null);
  const navRef = useRef(null);

  // Search filters deals by name or what's inside ("broast", "chai", ...).
  const groups = useMemo(() => {
    const v = q.trim().toLowerCase();
    return GROUPS.map((g) => ({ ...g, shown: g.list.filter((d) => !v || `${d.n} ${d.d} ${g.name}`.toLowerCase().includes(v)) }));
  }, [q]);
  const anyMatch = groups.some((g) => g.shown.length);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef(null);
  const barRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const spy = () => {
      let id = GROUPS[0]?.id;
      for (const g of GROUPS) {
        const el = document.getElementById(`deals-${g.id}`);
        if (el && el.getBoundingClientRect().top - 120 <= 0) id = g.id;
      }
      setActive(id);
    };
    spy();
    addEventListener("scroll", spy, { passive: true });
    return () => removeEventListener("scroll", spy);
  }, [q]);

  // Phone search button: bring the deals search bar back under the sticky chips, then focus it.
  const goToSearch = () => {
    const box = searchRef.current;
    if (!box) return;
    const navH = navRef.current?.offsetHeight || 0;
    window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - navH - 12, behavior: smooth() });
    box.querySelector("input")?.focus({ preventScroll: true });
  };

  useEffect(() => {
    const bar = barRef.current;
    const b = bar?.querySelector(`[data-target="${active}"]`);
    if (b) bar.scrollTo({ left: b.offsetLeft - bar.clientWidth / 2 + b.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <>
      <div className="wrap pt-4 sm:pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline">
          <Icon name="left" className="size-4" strokeWidth={2.6} />
          Back to menu
        </Link>
        <div className="mt-1 flex flex-wrap items-end gap-x-4 gap-y-1">
          <h1 className="heading text-[clamp(34px,4.4vw,48px)] text-maroon">Deals</h1>
          <p className="pb-1.5 text-sm text-muted sm:text-[15px]">Fresh offers every day. Prices already include the discount.</p>
        </div>

        <div className={`mt-4 grid gap-4 sm:mt-5 ${SIDE.length ? "lg:grid-cols-[1.6fr_1fr]" : ""}`}>
          <DealsHero slides={SLIDES} />
          {SIDE.length > 0 && (
            <div className="hidden gap-4 lg:grid lg:grid-rows-2">
              {SIDE.map((d, i) => <DealMiniCard key={d.id} deal={d} tone={i ? "yellow" : "maroon"} />)}
            </div>
          )}
        </div>
      </div>

      <div ref={sentinelRef} aria-hidden="true" className="mt-5 h-px sm:mt-7" />
      <nav ref={navRef} aria-label="Deal categories" className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${stuck ? "bg-white/95 shadow-[0_1px_0_var(--color-line),0_8px_24px_rgba(34,20,15,.08)] backdrop-blur-md" : ""}`}>
        <div className="wrap">
          <div ref={barRef} className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-2.5 sm:gap-2.5">
            {groups.map((g) => (
              <button
                key={g.id}
                type="button"
                data-target={g.id}
                aria-current={active === g.id ? "true" : undefined}
                onClick={() => document.getElementById(`deals-${g.id}`)?.scrollIntoView({ behavior: smooth() })}
                style={{ opacity: g.shown.length ? 1 : 0.4 }}
                className={`flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition duration-300 ease-brand sm:text-sm ${
                  active === g.id ? "bg-yellow text-maroon-dark shadow-[0_6px_16px_rgba(242,174,0,.4)]" : "bg-white text-ink shadow-[0_0_0_1px_var(--color-line)] hover:text-maroon"
                }`}
              >
                {g.name}
                <span className={`rounded-full px-1.5 text-[10.5px] font-bold leading-[18px] ${active === g.id ? "bg-maroon text-white" : "bg-cream text-muted"}`}>{g.shown.length}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      <SearchButton show={stuck} onClick={goToSearch} label="Search deals" />
      <BackToTop show={stuck} />

      <div className="wrap">
        <label ref={searchRef} htmlFor="deal-q" className="mt-4 flex items-center gap-3 rounded-[14px] bg-white py-1 pl-4 pr-1 shadow-[0_0_0_1px_var(--color-line)] transition focus-within:shadow-[0_0_0_2px_var(--color-yellow),0_10px_26px_rgba(242,174,0,.18)] sm:mt-5 sm:pl-[18px]">
          <Icon name="search" className="size-[22px] flex-none text-muted" />
          <span className="sr-only">Search deals</span>
          <input id="deal-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search deals: broast, pizza, chai…" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-[#a99a90]" />
          {q && <button type="button" onClick={() => setQ("")} className="rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-muted hover:bg-cream hover:text-maroon">Clear</button>}
        </label>

        {groups.map((g) => g.shown.length > 0 && (
          <section key={g.id} id={`deals-${g.id}`} aria-labelledby={`deals-${g.id}-h`} className="scroll-mt-[64px] pt-8 sm:pt-12">
            <h2 id={`deals-${g.id}-h`} className="heading mb-5 text-[clamp(28px,3.4vw,40px)] after:mt-3 after:block after:h-[5px] after:w-[90px] after:rounded after:bg-yellow">
              <small className="mb-0.5 block font-script text-2xl text-maroon">{g.script}</small>
              {g.name}
            </h2>
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 md:gap-5 xl:grid-cols-3 xl:gap-[22px]">
              {g.shown.map((d) => <MenuItemCard key={d.id} item={d} />)}
            </div>
          </section>
        ))}
        {!anyMatch && (
          <div className="pb-5 pt-16 text-center text-muted">
            <b className="block font-display text-[28px] font-normal text-ink">No deals match that</b>
            Try “broast”, “pizza” or “chai”.
          </div>
        )}
      </div>
    </>
  );
}
