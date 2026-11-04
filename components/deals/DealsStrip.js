"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DealMiniCard from "@/components/deals/DealMiniCard";
import Icon, { Glyph } from "@/components/ui/Icon";
import { DEALS } from "@/data/menu";

// Featured deals first, then today's, then the rest; the home page shows the first few.
const HOT = [...DEALS].sort((a, b) => (b.featured ? 2 : b.group === "today" ? 1 : 0) - (a.featured ? 2 : a.group === "today" ? 1 : 0)).slice(0, 6);

// Home page "Hot Deals": heading with a link to /deals and a swipeable row of deal cards.
export default function DealsStrip() {
  const rowRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const measure = () => {
      const card = row.firstElementChild;
      const step = card ? card.offsetWidth + 14 : row.clientWidth;
      const perView = Math.max(1, Math.round(row.clientWidth / step));
      setPages(Math.max(1, HOT.length - perView + 1));
      setPage(Math.min(Math.round(row.scrollLeft / step), HOT.length - perView));
    };
    measure();
    row.addEventListener("scroll", measure, { passive: true });
    addEventListener("resize", measure);
    return () => {
      row.removeEventListener("scroll", measure);
      removeEventListener("resize", measure);
    };
  }, []);

  const goTo = (i) => {
    const row = rowRef.current;
    const card = row?.children[i];
    if (card) row.scrollTo({ left: card.offsetLeft - row.firstElementChild.offsetLeft, behavior: "smooth" });
  };

  return (
    <section aria-labelledby="hot-deals-h" className="wrap pt-8 sm:pt-10">
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-red text-white shadow-[0_6px_14px_rgba(227,38,45,.3)]">
          <Glyph name="flame" className="size-5" />
        </span>
        <h2 id="hot-deals-h" className="heading text-[26px] text-maroon sm:text-[32px]">Hot Deals</h2>
        <div className="ml-auto flex items-center gap-2">
          {[["left", -1], ["right", 1]].map(([icon, d]) => (
            <button key={icon} type="button" aria-label={d < 0 ? "Previous deals" : "Next deals"} onClick={() => goTo(Math.min(Math.max(page + d, 0), pages - 1))} disabled={d < 0 ? page === 0 : page >= pages - 1}
              className="hidden size-10 place-items-center rounded-full bg-white text-maroon shadow-[0_0_0_1px_var(--color-line)] transition hover:bg-yellow disabled:opacity-35 md:grid">
              <Icon name={icon} className="size-5" strokeWidth={2.4} />
            </button>
          ))}
          <Link href="/deals" className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-maroon shadow-[0_0_0_1px_var(--color-line)] transition hover:bg-yellow sm:text-sm">
            View all
            <Icon name="right" className="size-4" strokeWidth={2.6} />
          </Link>
        </div>
      </div>

      <div ref={rowRef} className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mx-0 sm:scroll-px-0 sm:px-0">
        {HOT.map((d, i) => (
          <DealMiniCard key={d.id} deal={d} tone={i % 2 ? "yellow" : "maroon"} className="w-[82%] max-w-[340px] flex-none snap-start sm:w-[340px]" />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-2 flex justify-center gap-1.5">
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} type="button" aria-label={`Deals ${i + 1}`} aria-current={i === page} onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-6 bg-maroon" : "w-2 bg-[#dccfbf]"}`} />
          ))}
        </div>
      )}
    </section>
  );
}
