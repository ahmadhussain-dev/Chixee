"use client";
import ItemThumb from "@/components/menu/ItemThumb";
import { useCart } from "@/context/CartContext";
import { useItemModal } from "@/context/ItemModalContext";
import { formatPKR, fromPrice } from "@/data/menu";

// Menu card. Tapping anywhere on it (photo, text or Add To Cart) opens the item popup.
export default function MenuItemCard({ item, compact = false }) {
  const { lines } = useCart();
  const { openItem } = useItemModal();
  const inCart = lines.filter((l) => l.id === item.id).reduce((s, l) => s + l.qty, 0);
  const many = item.sizes && Object.keys(item.sizes).length > 1;
  const open = () => openItem(item.id);

  return (
    <article className={`group relative flex gap-4 rounded-[18px] bg-white p-4 shadow-[0_0_0_1px_var(--color-line)] transition duration-300 ease-brand hover:-translate-y-1.5 hover:shadow-[0_22px_40px_rgba(107,13,17,.12)] ${compact ? "gap-3 p-3" : "sm:gap-[18px]"}`}>
      {/* Whole-card hit area */}
      <button type="button" onClick={open} aria-label={`${item.n}, ${many ? "from " : ""}${formatPKR(fromPrice(item))}. View options`} className="absolute inset-0 z-[1] cursor-pointer rounded-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon" />
      <div className={`relative aspect-square flex-none self-start overflow-hidden rounded-[14px] bg-yellow ${compact ? "w-24" : "w-[38%] max-w-[190px] sm:w-[42%]"}`}>
        <ItemThumb item={item} small={compact} sizes={compact ? "96px" : "190px"} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        {item.tag && <span className="w-fit rounded-full bg-maroon px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-[.6px] text-yellow">{item.tag}</span>}
        <h3 className={`font-bold leading-tight text-balance ${compact ? "text-[15px]" : "text-[16.5px] sm:text-lg"}`}>{item.n}</h3>
        {!compact && <p className="text-[13.5px] leading-normal text-muted">{item.d}</p>}
        {many && <p className="text-xs font-semibold text-maroon">{Object.keys(item.sizes).length} options</p>}
        <div className="mt-auto flex flex-col items-start gap-2.5 pt-1.5">
          <span className="text-[19px] font-bold tabular-nums">
            {many && <span className="text-sm font-semibold text-muted">from </span>}
            {formatPKR(fromPrice(item))}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={open}
              tabIndex={-1}
              className="relative z-[2] rounded-[11px] bg-maroon px-5 py-2.5 font-bold text-white shadow-[0_6px_14px_rgba(163,22,27,.3)] transition duration-200 ease-brand hover:-translate-y-0.5 hover:bg-maroon-dark active:scale-95"
            >
              Add To Cart
            </button>
            {inCart > 0 && <span className="rounded-full bg-yellow-soft px-2.5 py-1 text-xs font-bold text-maroon-dark ring-1 ring-yellow">{inCart} in cart</span>}
          </div>
        </div>
      </div>
    </article>
  );
}
