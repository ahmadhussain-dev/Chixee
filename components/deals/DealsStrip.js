"use client";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import DealMiniCard from "@/components/deals/DealMiniCard";
import DealsPattern from "@/components/deals/DealsPattern";
import HotBadge from "@/components/deals/HotBadge";
import Icon from "@/components/ui/Icon";
import { useCatalog } from "@/context/CatalogContext";


// Home page "Hot Deals": heading with a link to /deals and a row of deal cards that keeps gliding
// left to right. It stops while the cursor is over it (or a finger is on it, or a card has focus).
// The list is drawn twice so the loop is seamless. The second copy is hidden from screen readers and
// skipped by Tab, but stays clickable (not `inert`), since it is the copy on screen half of the time.
export default function DealsStrip() {
  const { DEALS } = useCatalog();
  // Featured deals first, then today's, then the rest.
  const HOT = useMemo(() => [...DEALS].sort((a, b) => (b.featured ? 2 : b.group === "today" ? 1 : 0) - (a.featured ? 2 : a.group === "today" ? 1 : 0)), [DEALS]);
  const [held, setHeld] = useState(false);
  const resume = useRef(null);
  const hold = () => {
    clearTimeout(resume.current);
    setHeld(true);
  };
  const release = (delay = 0) => {
    clearTimeout(resume.current);
    resume.current = setTimeout(() => setHeld(false), delay);
  };

  return (
    <section aria-labelledby="hot-deals-h" className="wrap pt-8 sm:pt-10">
      {/* A regular page section (inside the page width, rounded) with the red Hot Deals backdrop */}
      <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(ellipse_at_50%_0%,#c4262c,#8c1218_60%,#5e0a0e)] pb-3 pt-5 shadow-[0_16px_30px_rgba(107,13,17,.2)] sm:rounded-[28px] sm:pt-6">
        <svg aria-hidden="true" viewBox="0 0 1440 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
          <path d="M0 0h520C380 90 220 120 0 110Z" fill="#000" fillOpacity=".12" />
          <path d="M1440 0H980c160 70 300 150 460 130Z" fill="#000" fillOpacity=".12" />
          <path d="M0 330c260-50 520 10 760-10s440-80 680-40v120H0Z" fill="#6b0d11" fillOpacity=".55" />
        </svg>
        <DealsPattern />

        {/* Heading on the left (flame badge + "Hot Deals"), View all on the right, as before */}
        <div className="relative flex items-center gap-2.5 px-4 sm:px-6">
          <Link href="/deals" className="group flex items-center gap-2" aria-label="Hot Deals, see all deals">
            <span className="animate-wiggle drop-shadow-[0_0_14px_rgba(255,170,30,.6)] transition-transform group-hover:scale-110">
              <HotBadge className="h-11 w-10 sm:h-14 sm:w-12" />
            </span>
            <h2 id="hot-deals-h" className="heading inline-block origin-bottom animate-jelly text-[28px] leading-none text-white [text-shadow:0_3px_12px_rgba(0,0,0,.3)] sm:text-[36px]">
              Hot <span className="text-yellow">Deals</span>
            </h2>
          </Link>
          <Link href="/deals" className="ml-auto inline-flex items-center gap-1 rounded-full bg-yellow px-3.5 py-2 text-[13px] font-bold text-maroon-dark shadow-[0_6px_14px_rgba(0,0,0,.25)] transition hover:bg-white sm:text-sm">
            View all
            <Icon name="right" className="size-4" strokeWidth={2.6} />
          </Link>
        </div>

      <div
        className="no-scrollbar relative -mb-3 -mt-4 overflow-hidden pb-10 pt-9 motion-reduce:overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]"
        onMouseEnter={hold}
        onMouseLeave={() => release()}
        onTouchStart={hold}
        onTouchEnd={() => release(2500)}
        onFocus={hold}
        onBlur={() => release()}
      >
        <div className="flex w-max animate-marquee-right motion-reduce:animate-none" style={{ animationPlayState: held ? "paused" : "running", animationDuration: `${HOT.length * 8}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex flex-none gap-3.5 pr-3.5" aria-hidden={copy ? true : undefined}>
              {HOT.map((d, i) => (
                <DealMiniCard key={d.id} deal={d} tabIndex={copy ? -1 : undefined} tone={i % 2 ? "cream" : "maroon"} className="w-[300px] flex-none sm:w-[340px]" />
              ))}
            </div>
          ))}
        </div>
      </div>

      </div>
    </section>
  );
}
