"use client";
import { useState } from "react";
import ItemThumb from "@/components/menu/ItemThumb";
import QtyStepper from "@/components/ui/QtyStepper";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { defaultSize, formatPKR, priceOf } from "@/data/menu";

export default function MenuItemCard({ item, compact = false }) {
  const { qtyOf, add, setQty } = useCart();
  const toast = useToast();
  const [size, setSize] = useState(defaultSize(item));
  const qty = qtyOf(item.id, size);
  const price = priceOf(item, size);

  return (
    <article className={`group relative flex gap-4 rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_var(--color-line)] transition duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-[0_22px_40px_rgba(107,13,17,.12)] ${compact ? "gap-3 p-3" : "sm:gap-[18px]"}`}>
      <div className={`relative aspect-square flex-none self-start overflow-hidden rounded-[14px] ${item.img ? "bg-white" : "bg-yellow"} ${compact ? "w-24" : "w-[38%] max-w-[190px] sm:w-[42%]"}`}>
        {item.tag && <span className="absolute left-2.5 top-2.5 z-[2] rounded-full bg-maroon px-2 py-1 text-[11px] font-bold uppercase tracking-[.6px] text-white">{item.tag}</span>}
        <ItemThumb item={item} small={compact} sizes={compact ? "96px" : "190px"} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <h3 className={`font-bold leading-tight text-balance ${compact ? "text-[15px]" : "text-[16.5px] sm:text-lg"}`}>{item.n}</h3>
        {!compact && <p className="text-[13.5px] leading-normal text-muted">{item.d}</p>}
        {item.sizes && (
          <div className="mt-1 flex flex-wrap gap-1.5" role="group" aria-label="Size">
            {Object.keys(item.sizes).map((z) => (
              <button key={z} type="button" aria-pressed={size === z} onClick={() => setSize(z)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${size === z ? "bg-ink text-white" : "text-muted shadow-[inset_0_0_0_1.5px_var(--color-line)]"}`}>
                {z}
              </button>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-col items-start gap-2.5 pt-1.5">
          <span className="text-[19px] font-bold tabular-nums">{formatPKR(price)}</span>
          {qty ? (
            <QtyStepper qty={qty} onChange={(q) => setQty(item.id, size, q)} small={compact} />
          ) : (
            <button
              type="button"
              onClick={() => {
                add(item.id, size);
                toast(`${item.n}${size ? ` (${size})` : ""} added to cart`);
              }}
              className="rounded-[11px] bg-yellow px-5 py-2.5 font-bold text-maroon-dark shadow-[0_6px_14px_rgba(242,174,0,.3)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-[#ffcb2e] active:scale-95"
            >
              Add To Cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
