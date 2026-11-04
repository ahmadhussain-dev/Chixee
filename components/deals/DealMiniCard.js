"use client";
import ItemThumb from "@/components/menu/ItemThumb";
import { useItemModal } from "@/context/ItemModalContext";
import { formatPKR } from "@/data/menu";

// Compact deal card used in the home "Hot Deals" carousel and beside the big carousel on /deals.
// Maroon or yellow, text on the left and the food on a round tile on the right. Tapping opens the item popup.
export default function DealMiniCard({ deal, tone = "maroon", className = "" }) {
  const { openItem } = useItemModal();
  const maroon = tone === "maroon";
  return (
    <button
      type="button"
      onClick={() => openItem(deal.id)}
      aria-label={`${deal.n}, ${formatPKR(deal.p)}. View deal`}
      className={`group relative flex min-h-[156px] overflow-hidden rounded-[22px] text-left transition duration-300 ease-brand hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(107,13,17,.22)] ${maroon ? "bg-maroon text-white" : "bg-yellow text-ink"} ${className}`}
    >
      <span className="relative z-[2] flex min-w-0 flex-1 flex-col gap-1 py-4 pl-4 pr-3 sm:pl-5">
        {deal.badge && (
          <span className={`self-start rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[.8px] ${maroon ? "bg-yellow text-maroon-dark" : "bg-red text-white"}`}>{deal.badge}</span>
        )}
        <span className="font-display text-[21px] leading-[1.05] sm:text-[23px]">{deal.n}</span>
        <span className={`line-clamp-2 text-[11.5px] leading-snug ${maroon ? "text-white/85" : "text-ink/75"}`}>{deal.d}</span>
        <span className="mt-auto flex items-baseline gap-1.5 whitespace-nowrap pt-1">
          <b className="text-[19px] tabular-nums">{formatPKR(deal.p)}</b>
          {deal.was && <s className="text-xs opacity-70">{formatPKR(deal.was)}</s>}
        </span>
        <span className={`mt-1 self-start rounded-[10px] px-3.5 py-1.5 text-[12.5px] font-bold transition group-hover:-translate-y-0.5 ${maroon ? "bg-yellow text-maroon-dark" : "bg-red text-white shadow-[0_6px_14px_rgba(227,38,45,.3)]"}`}>
          Order deal
        </span>
      </span>
      <span aria-hidden="true" className="relative w-[42%] max-w-[160px] flex-none">
        <span className={`absolute left-0 top-1/2 aspect-square w-[calc(100%+56px)] -translate-y-1/2 rounded-full ${maroon ? "bg-yellow" : "bg-white"}`} />
        <span className="absolute inset-y-3 -right-1 left-0">
          <ItemThumb item={deal} sizes="170px" />
        </span>
      </span>
    </button>
  );
}
