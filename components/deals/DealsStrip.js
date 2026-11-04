"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import DealMiniCard from "@/components/deals/DealMiniCard";
import DealsPattern from "@/components/deals/DealsPattern";
import HotBadge from "@/components/deals/HotBadge";
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
    <section aria-labelledby="hot-deals-h" className="relative mt-8 overflow-hidden bg-[radial-gradient(ellipse_at_50%_20%,#c4262c,#8c1218_55%,#5e0a0e)] pb-14 pt-8 sm:mt-10 sm:pb-20 sm:pt-12">
      {/* Soft darker swooshes, scattered faint food/offer icons, and a yellow wave along the bottom */}
      <svg aria-hidden="true" viewBox="0 0 1440 400" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full">
        <path d="M0 0h520C380 90 220 120 0 110Z" fill="#000" fillOpacity=".12" />
        <path d="M1440 0H980c160 70 300 150 460 130Z" fill="#000" fillOpacity=".12" />
        <path d="M0 330c260-50 520 10 760-10s440-80 680-40v120H0Z" fill="#6b0d11" fillOpacity=".55" />
      </svg>
      <DealsPattern />
      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-8 w-full sm:h-12">
        <path d="M0 40c240-30 480-30 720-8s480 26 720-12v40H0Z" fill="#ffc20e" />
      </svg>

      {/* Heading: flame badge, white "Hot" + yellow "Deals", golden speed lines either side */}
      <div className="wrap relative flex items-center justify-center gap-3 sm:gap-5">
        <span aria-hidden="true" className="hidden flex-1 flex-col items-end gap-1.5 sm:flex">
          <span className="h-[3px] w-1/2 rounded bg-gradient-to-r from-transparent to-yellow" />
          <span className="h-[3px] w-full rounded bg-gradient-to-r from-transparent to-yellow" />
          <span className="h-[3px] w-1/3 rounded bg-gradient-to-r from-transparent to-yellow" />
        </span>
        <Link href="/deals" className="group flex items-center gap-2 sm:gap-3" aria-label="Hot Deals, see all deals">
          <span className="animate-wiggle drop-shadow-[0_0_18px_rgba(255,170,30,.6)] transition-transform group-hover:scale-110">
            <HotBadge className="h-14 w-12 sm:h-20 sm:w-[70px]" />
          </span>
          <h2 id="hot-deals-h" className="heading inline-block origin-bottom animate-jelly text-[40px] italic leading-none text-white [text-shadow:0_4px_18px_rgba(0,0,0,.35)] sm:text-[64px]">
            Hot <span className="text-yellow">Deals</span>
          </h2>
        </Link>
        <span aria-hidden="true" className="hidden flex-1 flex-col items-start gap-1.5 sm:flex">
          <span className="h-[3px] w-1/2 rounded bg-gradient-to-l from-transparent to-yellow" />
          <span className="h-[3px] w-full rounded bg-gradient-to-l from-transparent to-yellow" />
          <span className="h-[3px] w-1/3 rounded bg-gradient-to-l from-transparent to-yellow" />
        </span>
      </div>
      <div className="wrap relative mt-1.5 flex items-center justify-center gap-3">
        <span aria-hidden="true" className="h-0.5 w-10 rounded bg-gradient-to-r from-transparent to-yellow sm:w-24" />
        <p className="text-[17px] font-semibold italic text-white sm:text-[22px]">Fresh offers, made to share</p>
        <span aria-hidden="true" className="h-0.5 w-10 rounded bg-gradient-to-l from-transparent to-yellow sm:w-24" />
      </div>

      <div
        className="no-scrollbar relative mt-1 overflow-hidden pb-12 pt-6 sm:mt-3 motion-reduce:overflow-x-auto [mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]"
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
                <DealMiniCard key={d.id} deal={d} tone={i % 2 ? "cream" : "maroon"} className="w-[300px] flex-none sm:w-[340px]" />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative -mt-6 flex justify-center">
        <Link href="/deals" className="inline-flex items-center gap-2 rounded-full bg-yellow px-7 py-3 text-base font-bold text-maroon-dark shadow-[0_10px_24px_rgba(0,0,0,.3)] transition hover:-translate-y-0.5 hover:bg-white sm:text-lg">
          View all deals
          <Icon name="right" className="size-4" strokeWidth={2.6} />
        </Link>
      </div>
    </section>
  );
}
