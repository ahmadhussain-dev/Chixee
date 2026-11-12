"use client";
import { Plus, Trash2, Users } from "lucide-react";
import ItemThumb from "@/components/menu/ItemThumb";
import { useCart } from "@/context/CartContext";
import { useItemModal } from "@/context/ItemModalContext";
import { formatPKR } from "@/lib/menu";

// Deal card on /deals: "% OFF" tag, photo with a "serves" badge, name and contents,
// crossed-out menu price above the deal price, and a round + button (a − qty + stepper once added).
// Every group uses the brand card: yellow photo tile on a maroon body. tone "light" (white body) is kept for other uses.
export default function DealCard({ deal, tone = "maroon" }) {
  const { lines, setLineQty, add } = useCart();
  const { openItem } = useItemModal();
  const mine = lines.filter((l) => l.id === deal.id);
  const inCart = mine.reduce((s, l) => s + l.qty, 0);
  const last = mine.at(-1);
  const pct = deal.was ? Math.round(((deal.was - deal.p) / deal.was) * 100) : 0;
  const maroon = tone === "maroon";
  const open = () => openItem(deal.id);
  const round = "relative z-[2] grid size-10 flex-none place-items-center rounded-full transition duration-200 ease-brand hover:scale-110 active:scale-95 sm:size-11";

  return (
    <div className="relative pt-3">
      {pct > 0 && (
        <span className="absolute left-2.5 top-0 z-[3] rounded-full bg-red px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-white shadow-[0_4px_10px_rgba(227,38,45,.4)] ring-2 ring-white sm:text-xs">
          {pct}% OFF
        </span>
      )}
      <article
        className={`group relative flex h-full flex-col overflow-hidden rounded-[18px] transition duration-300 ease-brand hover:-translate-y-1 ${
          maroon ? "bg-maroon text-white shadow-[0_12px_26px_rgba(107,13,17,.25)]" : "bg-white shadow-[0_0_0_1px_var(--color-line),0_8px_20px_rgba(34,20,15,.05)] hover:shadow-[0_20px_36px_rgba(107,13,17,.12)]"
        } ${inCart ? "ring-2 ring-yellow" : ""}`}
      >
        <button type="button" onClick={open} aria-label={`${deal.n}, ${formatPKR(deal.p)}. View deal`} className="absolute inset-0 z-[1] cursor-pointer rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon" />
        <div className={`relative aspect-[4/3] overflow-hidden bg-yellow`}>
          <ItemThumb item={deal} sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 300px" />
          {deal.serves && (
            <span className="absolute bottom-2 right-2 z-[2] inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-ink shadow-[0_4px_10px_rgba(0,0,0,.12)] sm:text-[13px]" title={`Serves ${deal.serves}`}>
              <Users aria-hidden="true" strokeWidth={1.75} className="size-4 text-yellow-deep" />
              <span className="sr-only">Serves </span>
              {deal.serves}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3 sm:p-4">
          {deal.when && (
            <span className={`self-start rounded-full px-2 py-0.5 text-[10.5px] font-semibold sm:text-[11px] ${maroon ? "bg-yellow text-maroon-dark" : "bg-yellow-soft text-maroon-dark"}`}>{deal.when}</span>
          )}
          <h3 className="text-[14.5px] font-bold leading-tight sm:text-[17px]">{deal.n}</h3>
          <p className={`line-clamp-2 text-[11.5px] leading-snug sm:text-[13px] ${maroon ? "text-white/80" : "text-muted"}`}>{deal.d}</p>
          <div className="mt-auto flex items-end justify-between gap-2 pt-2">
            <div className="min-w-0 whitespace-nowrap leading-tight">
              {deal.was && <s className={`block text-[11.5px] sm:text-[13px] ${maroon ? "text-white/65" : "text-muted"}`}>{formatPKR(deal.was)}</s>}
              <b className="text-[16px] tabular-nums sm:text-[20px]">{formatPKR(deal.p)}</b>
            </div>
            {inCart > 0 ? (
              <span className="relative z-[2] inline-flex animate-pop items-center gap-1 rounded-full bg-white p-1 text-ink shadow-[0_4px_12px_rgba(107,13,17,.15)] ring-1 ring-yellow">
                <button type="button" aria-label={`Remove one ${deal.n}`} onClick={() => setLineQty(last.key, last.qty - 1)} className="grid size-7 place-items-center rounded-full text-maroon ring-1 ring-maroon/25 transition hover:bg-maroon hover:text-white">
                  {inCart === 1 ? <Trash2 aria-hidden="true" className="size-3.5" /> : <span className="text-lg leading-none">−</span>}
                </button>
                <output aria-live="polite" className="min-w-4 text-center text-sm font-bold tabular-nums">{inCart}</output>
                <button type="button" aria-label={`Add one more ${deal.n}`} onClick={() => add(last.id, last.size, 1, { note: last.note, ifUnavailable: last.ifUnavailable })} className="grid size-7 place-items-center rounded-full text-maroon ring-1 ring-maroon/25 transition hover:bg-maroon hover:text-white">
                  <span className="text-lg leading-none">+</span>
                </button>
              </span>
            ) : (
              <button type="button" onClick={open} aria-label={`Add ${deal.n} to cart`} className={`${round} bg-yellow text-maroon-dark shadow-[0_6px_14px_rgba(242,174,0,.45)]`}>
                <Plus aria-hidden="true" strokeWidth={2.5} className="size-5 sm:size-6" />
              </button>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
