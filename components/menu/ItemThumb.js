import Image from "next/image";
import { Glyph } from "@/components/ui/Icon";
import { imgSrc } from "@/data/menu";

// Product picture: the background-removed item sitting on a plain brand-yellow tile.
// The parent provides the yellow box; items without a photo yet show a food glyph instead.
export default function ItemThumb({ item, small = false, sizes = "190px" }) {
  const src = imgSrc(item);
  if (src) {
    return (
      <div className={`absolute inset-0 ${small ? "p-1.5" : "p-3 sm:p-4"}`}>
        <div className="relative size-full">
          <Image
            src={src}
            alt={item.n}
            fill
            sizes={sizes}
            className="object-contain drop-shadow-[0_10px_14px_rgba(107,13,17,.28)] transition-transform duration-700 ease-brand group-hover:scale-[1.07]"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center text-maroon">
      <Glyph name={item.glyph} className={small ? "size-6" : "size-12"} />
    </div>
  );
}
