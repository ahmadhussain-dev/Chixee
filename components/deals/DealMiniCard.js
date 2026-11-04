"use client";
import { CalendarDays, Clock, Crown, Hamburger, Moon, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import ItemThumb from "@/components/menu/ItemThumb";
import { formatPKR } from "@/data/menu";

// Badge icon per deal group; the "Deal of the day" gets a crown.
const BADGE_ICON = { today: Clock, weekly: CalendarDays, combos: Hamburger, family: Users, late: Moon };

// Compact deal card for the home "Hot Deals" row. tone "maroon" (red body) or "cream" (light body);
// text on the left, the food on a yellow arc on the right. The featured "Deal of the day" glows.
// Tapping it goes to that deal's category on /deals (e.g. /deals#deals-weekly).
export default function DealMiniCard({ deal, tone = "maroon", className = "" }) {
  const maroon = tone === "maroon";
  const star = deal.badge === "Deal of the day";
  const BIcon = star ? Crown : BADGE_ICON[deal.group];
  return (
    <Link
      href={`/deals#deals-${deal.group}`}
      aria-label={`${deal.n}, ${formatPKR(deal.p)}. See ${deal.badge || "this deal"} on the deals page`}
      className={`group relative flex min-h-[176px] overflow-hidden rounded-[22px] text-left transition duration-300 ease-brand hover:-translate-y-1 ${
        maroon ? "bg-[linear-gradient(135deg,#c4262c,#8c1218_70%)] text-white" : "bg-[#fdf1dc] text-ink"
      } ${star ? "shadow-[0_0_0_3px_#ffc20e,0_0_26px_rgba(255,194,14,.55)]" : "shadow-[0_14px_30px_rgba(40,4,6,.35)]"} ${className}`}
    >
      <span className="relative z-[2] flex min-w-0 flex-1 flex-col gap-1 py-4 pl-4 pr-2 sm:pl-5">
        {deal.badge && (
          <span className={`inline-flex items-center gap-1 self-start rounded-full px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[.6px] ${maroon ? "bg-yellow text-maroon-dark" : "bg-red text-white"}`}>
            {BIcon && <BIcon aria-hidden="true" strokeWidth={2.2} className="size-3.5" />}
            {deal.badge}
          </span>
        )}
        <span className={`font-display text-[21px] leading-[1.05] sm:text-[23px] ${maroon ? "" : "text-maroon-dark"}`}>{deal.n}</span>
        <span className={`line-clamp-2 text-[11.5px] leading-snug ${maroon ? "text-white/85" : "text-ink/75"}`}>{deal.d}</span>
        <span className="mt-auto flex items-baseline gap-1.5 whitespace-nowrap pt-1">
          <b className={`text-[20px] tabular-nums ${maroon ? "text-yellow" : "text-maroon-dark"}`}>{formatPKR(deal.p)}</b>
          {deal.was && <s className="text-xs opacity-70">{formatPKR(deal.was)}</s>}
        </span>
        <span className={`mt-1 inline-flex items-center gap-1.5 self-start rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition group-hover:-translate-y-0.5 ${maroon ? "bg-yellow text-maroon-dark shadow-[0_6px_14px_rgba(255,194,14,.35)]" : "bg-red text-white shadow-[0_6px_14px_rgba(227,38,45,.3)]"}`}>
          <ShoppingCart aria-hidden="true" strokeWidth={2.2} className="size-4" />
          Order deal
        </span>
      </span>
      <span aria-hidden="true" className="relative w-[42%] max-w-[160px] flex-none">
        <span className="absolute left-0 top-1/2 aspect-square w-[calc(100%+60px)] -translate-y-1/2 rounded-full bg-yellow" />
        <span className="absolute inset-y-3 -right-1 left-0">
          <ItemThumb item={deal} sizes="170px" />
        </span>
      </span>
    </Link>
  );
}
