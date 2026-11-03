import Image from "next/image";
import { Glyph } from "@/components/ui/Icon";
import { imgSrc } from "@/data/menu";

// Photo if the item has one, otherwise the branded yellow tile with a food glyph.
export default function ItemThumb({ item, small = false, sizes = "190px" }) {
  const src = imgSrc(item);
  if (src) {
    return <Image src={src} alt={item.n} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.08]" />;
  }
  return (
    <div className="tile-bg absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden p-2.5 text-center text-maroon">
      <Glyph name={item.glyph} className={`relative ${small ? "size-6" : "size-11"}`} />
      {!small && (
        <i className="tile-text relative font-display text-[clamp(18px,1.7vw,24px)] uppercase not-italic leading-[.98] text-balance text-white">
          {item.n.replace(/\(.*?\)/, "").trim()}
        </i>
      )}
    </div>
  );
}
