"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BadgePercent, CakeSlice, CirclePlus, Coffee, CupSoda, Drumstick, Fish, Hamburger, Pizza, Utensils } from "lucide-react";
import Icon from "@/components/ui/Icon";
import MenuItemCard from "@/components/menu/MenuItemCard";
import { useCatalog } from "@/context/CatalogContext";
import { BackToTop, SearchButton, smooth } from "@/components/ui/FloatingButtons";

// Lucide icons for the Explore Menu tiles (stroke 1.5, brand maroon #A3161B, 40px on tablet/desktop).
const CATEGORY_ICONS = { broast: Drumstick, fish: Fish, pizza: Pizza, burgers: Hamburger, chai: Coffee, desserts: CakeSlice, drinks: CupSoda, addons: CirclePlus };
// Tall icon tiles on phones and tablets; one-line pills on desktop so the sticky bar stays slim.
const tileCls = () =>
  "group/tab flex w-[86px] flex-none flex-col items-center gap-1.5 rounded-2xl px-2 py-2.5 text-[12px] font-semibold leading-tight transition-all duration-300 ease-brand sm:w-[112px] sm:py-3 sm:text-[13.5px] lg:w-auto lg:flex-row lg:gap-2 lg:rounded-full lg:py-2 lg:pl-3 lg:pr-4 lg:text-sm";
const iconCls = () => "size-8 transition-all duration-300 group-hover/tab:scale-110 sm:size-10 lg:size-7";

export default function MenuBrowser() {
  const { MENU, ITEMS } = useCatalog();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(MENU[0]?.id);
  const [stuck, setStuck] = useState(false);
  const tabsRef = useRef(null);
  const sentinelRef = useRef(null);
  const searchRef = useRef(null);
  const navRef = useRef(null);

  const sections = useMemo(() => {
    const v = q.trim().toLowerCase();
    return MENU.map((c) => ({
      ...c,
      list: ITEMS.filter((i) => i.category === c.id && (!v || `${i.n} ${i.d} ${c.name}`.toLowerCase().includes(v))),
    }));
  }, [q, MENU, ITEMS]);
  const anyMatch = sections.some((s) => s.list.length);

  // "Stuck" = the category bar has reached the top of the screen.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const isStuck = !e.isIntersecting && e.boundingClientRect.top < 0;
      setStuck(isStuck);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scrollspy: highlight the category currently under the sticky bar.
  useEffect(() => {
    const spy = () => {
      let id = MENU[0]?.id;
      for (const c of MENU) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top - 130 <= 0) id = c.id;
      }
      setActive(id);
    };
    spy();
    addEventListener("scroll", spy, { passive: true });
    return () => removeEventListener("scroll", spy);
  }, [q, MENU]);

  // Keep the active category tile scrolled into view in the bar.
  useEffect(() => {
    const bar = tabsRef.current;
    const b = bar?.querySelector(`[data-target="${active}"]`);
    if (b) bar.scrollTo({ left: b.offsetLeft - bar.clientWidth / 2 + b.offsetWidth / 2, behavior: "smooth" });
  }, [active]);

  // Mobile search button: bring the menu search bar back into view just under the sticky categories, then focus it.
  const goToSearch = () => {
    const box = searchRef.current;
    if (!box) return;
    const navH = navRef.current?.offsetHeight || 0;
    window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - navH - 12, behavior: smooth() });
    box.querySelector("input")?.focus({ preventScroll: true });
  };

  return (
    <>
      <div className="wrap mt-8 flex items-center gap-4 sm:mt-10">
        <span aria-hidden="true" className="h-0.5 flex-1 rounded bg-gradient-to-r from-transparent to-yellow" />
        <h2 className="heading text-[26px] text-maroon sm:text-[32px]">Explore Menu</h2>
        <span aria-hidden="true" className="h-0.5 flex-1 rounded bg-gradient-to-l from-transparent to-yellow" />
      </div>
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      <nav ref={navRef} aria-label="Menu categories" className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${stuck ? "bg-white/95 shadow-[0_1px_0_var(--color-line),0_8px_24px_rgba(34,20,15,.08)] backdrop-blur-md" : ""}`}>
        <div className="wrap">
          <div className="flex items-center gap-2 sm:justify-center sm:gap-3.5">
            {/* Categories scroll sideways on phones; the Deals tile stays pinned on the right */}
            <div ref={tabsRef} className="no-scrollbar relative -ml-1 min-w-0 flex-initial overflow-x-auto py-2.5 pl-1 [mask-image:linear-gradient(90deg,#000_calc(100%-28px),transparent)] sm:ml-0 sm:pl-0 sm:[mask-image:none]">
              <div className="flex w-max gap-2 pr-6 sm:gap-3.5 sm:pr-0">
                {sections.map((c) => {
                  const CatIcon = CATEGORY_ICONS[c.id] || Utensils;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      data-target={c.id}
                      aria-current={active === c.id ? "true" : undefined}
                      onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: smooth() })}
                      style={{ opacity: c.list.length ? 1 : 0.4 }}
                      className={`${tileCls()} ${
                        active === c.id
                          ? "bg-yellow text-maroon-dark shadow-[0_6px_16px_rgba(242,174,0,.4)]"
                          : "bg-white text-ink shadow-[0_0_0_1px_var(--color-line),0_4px_10px_rgba(34,20,15,.04)] hover:-translate-y-0.5 hover:text-maroon"
                      }`}
                    >
                      <CatIcon aria-hidden="true" strokeWidth={1.5} color="#A3161B" className={iconCls()} />
                      <span className="whitespace-nowrap">{c.short || c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <Link href="/deals" className={`${tileCls()} bg-red text-white shadow-[0_6px_16px_rgba(227,38,45,.35)] hover:-translate-y-0.5`}>
              <BadgePercent aria-hidden="true" strokeWidth={1.5} className={`${iconCls()} animate-wiggle`} />
              <span className="inline-block animate-jelly whitespace-nowrap">Deals</span>
            </Link>
          </div>
        </div>
      </nav>
      <SearchButton show={stuck} onClick={goToSearch} />
      <BackToTop show={stuck} />

      <div className="wrap" id="menu">
        <label ref={searchRef} htmlFor="q" className="mt-5 flex scroll-mt-24 items-center gap-3 rounded-[14px] bg-white py-1 pl-4 pr-1 shadow-[0_0_0_1px_var(--color-line)] transition focus-within:shadow-[0_0_0_2px_var(--color-yellow),0_10px_26px_rgba(242,174,0,.18)] sm:mt-7 sm:pl-[18px]">
          <Icon name="search" className="size-[22px] flex-none text-muted" />
          <span className="sr-only">Search the menu</span>
          <input id="q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for broast, pizza, chai…" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3.5 text-base outline-none placeholder:text-[#a99a90]" />
          {q && <button type="button" onClick={() => setQ("")} className="rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-muted hover:bg-cream hover:text-maroon">Clear</button>}
        </label>

        {sections.map((c) =>
          c.list.length ? (
            <section key={c.id} id={c.id} aria-labelledby={`${c.id}-h`} className="scroll-mt-[100px] pt-9 sm:scroll-mt-[114px] sm:pt-14 lg:scroll-mt-[76px]">
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
