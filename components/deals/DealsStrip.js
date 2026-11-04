"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import DealMiniCard from "@/components/deals/DealMiniCard";
import DealsPattern from "@/components/deals/DealsPattern";
import { BadgePercent } from "lucide-react";
import Icon from "@/components/ui/Icon";
import { DEALS } from "@/data/menu";

// Featured deals first, then today's, then the rest.
const HOT = [...DEALS].sort((a, b) => (b.featured ? 2 : b.group === "today" ? 1 : 0) - (a.featured ? 2 : a.group === "today" ? 1 : 0));

// Home page "Hot Deals": heading with a link to /deals and a row of deal cards that keeps gliding
// left to right. It stops while the cursor is over it (or a finger is on it, or a card has focus).
// The list is drawn twice so the loop is seamless; the second copy is hidden from screen readers.
export default function DealsStrip() {
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
    <section aria-labelledby="hot-deals-h" className="relative mt-8 overflow-hidden border-y border-yellow/40 bg-[radial-gradient(ellipse_at_top,#fff3c4,#fdf6e7_60%)] py-7 sm:mt-10 sm:py-9">
      <DealsPattern />
      {/* Centred heading with fading lines either side, same as "Explore Menu"; badge and title still bounce */}
      <div className="wrap relative flex items-center gap-3 sm:gap-4">
        <span aria-hidden="true" className="h-0.5 flex-1 rounded bg-gradient-to-r from-transparent to-yellow" />
        <Link href="/deals" className="group flex items-center gap-2.5" aria-label="Hot Deals, see all deals">
          <span aria-hidden="true" className="relative grid size-10 flex-none place-items-center sm:size-12">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-red/35 [animation-duration:2.2s]" />
            <span className="relative grid size-full animate-wiggle place-items-center rounded-2xl bg-red text-white shadow-[0_8px_18px_rgba(227,38,45,.4)] transition-transform group-hover:scale-110">
              <BadgePercent strokeWidth={1.75} className="size-6 sm:size-8" />
            </span>
          </span>
          <h2 id="hot-deals-h" className="heading inline-block origin-bottom animate-jelly text-[26px] text-maroon sm:text-[32px]">Hot Deals</h2>
        </Link>
        <span aria-hidden="true" className="h-0.5 flex-1 rounded bg-gradient-to-l from-transparent to-yellow" />
      </div>
      <p className="relative mt-1 text-center font-script text-lg text-red sm:text-xl">Fresh offers, made to share</p>

      <div
        className="no-scrollbar relative mt-4 overflow-hidden pb-3 pt-1 motion-reduce:overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]"
        onMouseEnter={hold}
        onMouseLeave={() => release()}
        onTouchStart={hold}
        onTouchEnd={() => release(2500)}
        onFocus={hold}
        onBlur={() => release()}
      >
        <div className="flex w-max animate-marquee-right motion-reduce:animate-none" style={{ animationPlayState: held ? "paused" : "running", animationDuration: `${HOT.length * 8}s` }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex flex-none gap-3.5 pr-3.5" aria-hidden={copy ? true : undefined} inert={copy ? true : undefined}>
              {HOT.map((d, i) => (
                <DealMiniCard key={d.id} deal={d} tone={i % 2 ? "yellow" : "maroon"} className="w-[300px] flex-none sm:w-[340px]" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-2 flex justify-center">
        <Link href="/deals" className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_18px_rgba(107,13,17,.25)] transition hover:-translate-y-0.5 hover:bg-maroon-dark">
          View all deals
          <Icon name="right" className="size-4" strokeWidth={2.6} />
        </Link>
      </div>
    </section>
  );
}
