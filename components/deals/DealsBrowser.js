"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BadgePercent, CalendarDays, Flame, Hamburger, Moon, Users } from "lucide-react";
import DealCard from "@/components/deals/DealCard";
import DealsHero from "@/components/deals/DealsHero";
import Icon from "@/components/ui/Icon";
import { BackToTop, SearchButton, smooth } from "@/components/ui/FloatingButtons";
import { useCatalog } from "@/context/CatalogContext";
import { IMAGES } from "@/data/images";

const GROUP_ICONS = { Flame, CalendarDays, Hamburger, Users, Moon };
const PROMO = { id: "promo-late", promo: true, img: IMAGES.heroBroast, kicker: "Late cravings?", title: "Open till", highlight: "2 AM", text: "Delivery & pickup every day" };

// Strip under a group heading: the owner's banner photo if set, otherwise big text with the items' cut-outs.
function GroupBanner({ banner, icon: BIcon }) {
  if (banner.img) {
    return (
      <div className="relative mt-4 aspect-[3/1] overflow-hidden rounded-[22px] sm:aspect-[5/1]">
        <Image src={banner.img} alt={`${banner.t1} ${banner.t2}`} fill sizes="(max-width: 1280px) 100vw, 1240px" className="object-cover" />
      </div>
    );
  }
  const maroon = banner.tone === "maroon";
  return (
    <div aria-hidden="true" className={`relative mt-4 flex h-[118px] items-center overflow-hidden rounded-[22px] px-[18px] sm:h-[170px] sm:px-10 ${maroon ? "bg-[radial-gradient(circle_at_80%_50%,#c4262c,var(--color-maroon)_50%,var(--color-maroon-dark))] text-white" : "bg-yellow text-maroon-dark"}`}>
      <div className="relative z-[2] flex flex-col font-display uppercase leading-[.9]">
        <small className="mb-1 flex items-center gap-1.5 font-body text-[11px] font-bold tracking-[1px] opacity-85">{BIcon && <BIcon strokeWidth={1.75} className="size-4" />}Chixee</small>
        <span className="text-[34px] sm:text-[56px]">{banner.t1}</span>
        <span className={`text-[34px] sm:text-[56px] ${maroon ? "text-yellow" : "text-red"}`}>{banner.t2}</span>
        <em className="mt-1.5 font-body text-[11px] font-medium normal-case not-italic opacity-85 sm:text-sm">{banner.sub}</em>
      </div>
      <div className="absolute inset-y-0 right-0 w-[52%]">
        <span className={`absolute -right-[20%] top-1/2 aspect-square w-[110%] -translate-y-1/2 rounded-full ${maroon ? "bg-yellow" : "bg-white/35"}`} />
        {banner.artImgs.slice(0, 2).map((src, i) => (
          <div key={src} className={`absolute ${i ? "bottom-1 right-1 h-[62%] w-[34%]" : "right-[20%] top-[4%] h-[92%] w-[50%]"}`}>
            <Image src={src} alt="" fill sizes="240px" className="object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,.3)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

// /deals: promo + deals carousel, a maroon Deal Categories panel (tiles + search), sticky chips once it scrolls away,
// then each group with its heading, banner and a grid of deal cards (same maroon + yellow card in every group).
export default function DealsBrowser() {
  const { DEAL_GROUPS, DEALS } = useCatalog();
  const GROUPS = useMemo(() => DEAL_GROUPS.map((g) => ({ ...g, list: DEALS.filter((d) => d.group === g.id) })).filter((g) => g.list.length), [DEAL_GROUPS, DEALS]);
  const SLIDES = useMemo(() => {
    const featured = DEALS.filter((d) => d.featured);
    return [PROMO, ...(featured.length ? featured : DEALS.slice(0, 3))];
  }, [DEALS]);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(GROUPS[0]?.id);
  const searchRef = useRef(null);
  const navRef = useRef(null);

  // Search filters deals by name or what's inside ("broast", "chai", ...).
  const groups = useMemo(() => {
    const v = q.trim().toLowerCase();
    return GROUPS.map((g) => ({ ...g, shown: g.list.filter((d) => !v || `${d.n} ${d.d} ${g.name}`.toLowerCase().includes(v)) }));
  }, [q, GROUPS]);
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
  }, [q, GROUPS]);

  // Arriving from a home "Hot Deals" card (/deals#deals-weekly): land on that category once the page has laid out.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id.startsWith("deals-")) return;
    // Put the group heading just under the sticky chips; run twice in case Next's own hash scroll lands later.
    const land = () => {
      const el = document.getElementById(id);
      if (!el) return;
      const navH = navRef.current?.offsetHeight || 60;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navH + 20, behavior: "instant" });
    };
    const t1 = setTimeout(land, 150);
    const t2 = setTimeout(land, 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const goTo = (id) => document.getElementById(`deals-${id}`)?.scrollIntoView({ behavior: smooth() });

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
      <h1 className="sr-only">Chixee deals</h1>
      {/* Carousel: "Open till 2 AM" promo first, then featured deals */}
      <div className="wrap pt-3 sm:pt-5">
        {/* Way back to the main menu */}
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-sm sm:mb-4">
          <Link href="/#menu" className="inline-flex items-center gap-1.5 rounded-full bg-maroon py-2 pl-2.5 pr-4 font-semibold text-white shadow-[0_6px_14px_rgba(107,13,17,.25)] transition hover:-translate-y-0.5 hover:bg-maroon-dark">
            <Icon name="left" className="size-4" strokeWidth={2.6} />
            Back to menu
          </Link>
          <span aria-hidden="true" className="text-muted">/</span>
          <span aria-current="page" className="font-semibold text-maroon">Deals</span>
        </nav>
        <DealsHero slides={SLIDES} />
      </div>

      {/* Deal Categories panel: icon tiles + search */}
      <div className="wrap mt-4 sm:mt-6">
        <div className="rounded-[24px] bg-maroon px-3.5 pb-4 pt-5 text-white shadow-[0_16px_30px_rgba(107,13,17,.2)] sm:px-7 sm:pb-6 sm:pt-6">
          <h2 className="text-center font-display text-[26px] leading-none text-yellow sm:text-[32px]">Deal Categories</h2>
          <div className="no-scrollbar -mx-3.5 mt-4 overflow-x-auto px-3.5 sm:mx-0 sm:px-0">
            <div className="mx-auto flex w-max gap-2 sm:gap-3.5">
              {groups.map((g) => {
                const GIcon = GROUP_ICONS[g.icon] || BadgePercent;
                const on = active === g.id;
                return (
                  <button key={g.id} type="button" onClick={() => goTo(g.id)} style={{ opacity: g.shown.length ? 1 : 0.45 }}
                    className={`group/tile flex w-[84px] flex-none flex-col items-center gap-1.5 rounded-2xl px-1.5 py-2.5 text-center text-[11.5px] font-semibold leading-tight transition duration-300 ease-brand hover:-translate-y-0.5 sm:w-[124px] sm:py-3.5 sm:text-[13.5px] ${on ? "bg-yellow text-maroon-dark shadow-[0_8px_18px_rgba(0,0,0,.22)]" : "bg-white text-ink"}`}>
                    <GIcon aria-hidden="true" strokeWidth={1.5} color="#A3161B" className="size-8 transition-transform duration-300 group-hover/tile:scale-110 sm:size-10" />
                    {g.name}
                  </button>
                );
              })}
            </div>
          </div>
          <label ref={searchRef} htmlFor="deal-q" className="mt-4 flex scroll-mt-24 items-center gap-3 rounded-[14px] bg-white py-0.5 pl-4 pr-1 text-ink transition focus-within:shadow-[0_0_0_3px_var(--color-yellow)] sm:mt-5">
            <Icon name="search" className="size-[22px] flex-none text-muted" />
            <span className="sr-only">Search deals</span>
            <input id="deal-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search deals: broast, pizza, chai…" autoComplete="off" className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none placeholder:text-[#a99a90]" />
            {q && <button type="button" onClick={() => setQ("")} className="rounded-[10px] px-3.5 py-2 text-[13px] font-semibold text-muted hover:bg-cream hover:text-maroon">Clear</button>}
          </label>
        </div>
      </div>

      {/* Sticky chips once the panel scrolls away */}
      <div ref={sentinelRef} aria-hidden="true" className="mt-4 h-px" />
      <nav ref={navRef} aria-label="Deal categories" className={`sticky top-0 z-40 transition-[background-color,box-shadow,opacity] duration-300 ${stuck ? "bg-white/95 opacity-100 shadow-[0_1px_0_var(--color-line),0_8px_24px_rgba(34,20,15,.08)] backdrop-blur-md" : "pointer-events-none opacity-0"}`}>
        <div className="wrap">
          <div ref={barRef} className="no-scrollbar relative -mx-1 overflow-x-auto px-1 py-2.5">
            <div className="mx-auto flex w-max gap-2 sm:gap-2.5">
              <Link href="/#menu" tabIndex={stuck ? 0 : -1} className="flex flex-none items-center gap-1 whitespace-nowrap rounded-full bg-yellow py-2 pl-2.5 pr-4 text-[13px] font-semibold text-maroon-dark transition hover:bg-yellow-deep sm:py-2.5 sm:text-[15px]">
                <Icon name="left" className="size-4" strokeWidth={2.6} />
                Menu
              </Link>
              {groups.map((g) => (
                <button key={g.id} type="button" data-target={g.id} aria-current={active === g.id ? "true" : undefined} tabIndex={stuck ? 0 : -1} onClick={() => goTo(g.id)}
                  style={{ opacity: g.shown.length ? 1 : 0.4 }}
                  className={`flex flex-none items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition duration-300 ease-brand sm:px-5 sm:py-2.5 sm:text-[15px] ${
                    active === g.id ? "bg-maroon text-white shadow-[0_6px_16px_rgba(107,13,17,.3)]" : "bg-white text-ink shadow-[0_0_0_1px_var(--color-line)] hover:text-maroon"
                  }`}>
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      <SearchButton show={stuck} onClick={goToSearch} label="Search deals" />
      <BackToTop show={stuck} />

      <div className="wrap -mt-[60px]">
        {groups.map((g) => g.shown.length > 0 && (
          <section key={g.id} id={`deals-${g.id}`} aria-labelledby={`deals-${g.id}-h`} className="scroll-mt-[64px] pt-9 sm:pt-14">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-9 w-1.5 flex-none rounded-full bg-yellow sm:h-11" />
              <h2 id={`deals-${g.id}-h`} className="min-w-0">
                <small className="block font-script text-lg leading-none text-maroon sm:text-[22px]">{g.script}</small>
                <span className="block font-display text-[26px] uppercase leading-none tracking-wide sm:text-[36px]">{g.name}</span>
              </h2>
              <span className="mt-auto grid size-7 flex-none place-items-center rounded-full bg-white text-[13px] font-bold text-muted shadow-[0_0_0_1px_var(--color-line)] sm:size-8">{g.shown.length}</span>
            </div>
            {g.banner && <GroupBanner banner={g.banner} icon={GROUP_ICONS[g.icon]} />}
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 sm:gap-x-5 sm:gap-y-3 md:grid-cols-3 xl:grid-cols-4">
              {g.shown.map((d) => <DealCard key={d.id} deal={d} />)}
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
