import Image from "next/image";
import { Glyph } from "@/components/ui/Icon";
import { imgSrc } from "@/data/menu";

const shortName = (n) => n.replace(/\(.*?\)/, "").trim();

// Product picture on the brand yellow.
// `band` adds the promo-card look: a maroon strip across the top with the product name, photo below it.
// Small thumbnails (cart, checkout) skip the band and just show the photo or glyph on yellow.
export default function ItemThumb({ item, small = false, band = false, sizes = "190px" }) {
  const src = imgSrc(item);

  if (band) {
    return (
      <div className="absolute inset-0 flex flex-col bg-yellow">
        <span className="z-[1] flex min-h-[26%] flex-none items-center justify-center bg-maroon px-2 py-1.5 text-center font-display text-[clamp(13px,3.6vw,19px)] uppercase leading-[1.02] text-yellow text-balance shadow-[0_4px_10px_rgba(107,13,17,.25)] sm:text-[clamp(14px,1.45vw,19px)]">
          {shortName(item.n)}
        </span>
        <div className="relative min-h-0 flex-1 p-2 sm:p-2.5">
          <div className="relative size-full overflow-hidden rounded-[10px]">
          {src ? (
            <Image src={src} alt={item.n} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.08]" />
          ) : (
            <div className="tile-bg absolute inset-0 grid place-items-center overflow-hidden text-maroon">
              <Glyph name={item.glyph} className="relative size-11" />
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  if (src) {
    return <Image src={src} alt={item.n} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.08]" />;
  }
  return (
    <div className="tile-bg absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden p-2.5 text-center text-maroon">
      <Glyph name={item.glyph} className={`relative ${small ? "size-6" : "size-11"}`} />
      {!small && (
        <i className="tile-text relative font-display text-[clamp(18px,1.7vw,24px)] uppercase not-italic leading-[.98] text-balance text-white">
          {shortName(item.n)}
        </i>
      )}
    </div>
  );
}
