import Image from "next/image";
import { Glyph } from "@/components/ui/Icon";
import { imgSrc } from "@/data/menu";

// Product picture: the background-removed item sitting on a plain brand-yellow tile.
// The parent provides the yellow box; items without a photo yet show a food glyph instead.
// Spots for a deal's item photos when the deal has no picture of its own yet: main item, then two smaller extras.
const DEAL_SPOTS = [
  "left-[6%] top-[10%] w-[74%] h-[74%]",
  "right-[4%] bottom-[6%] w-[42%] h-[48%]",
  "right-[6%] top-[4%] w-[30%] h-[40%]",
];

export default function ItemThumb({ item, small = false, sizes = "190px" }) {
  // Deal without its own photo: arrange the cut-outs of what's inside.
  if (!item.img && item.art?.length > 1 && !small) {
    return (
      <div aria-hidden="true" className="absolute inset-0">
        {item.art.slice(0, 3).map((src, i) => (
          <div key={src + i} className={`absolute ${DEAL_SPOTS[i]} ${i === 0 ? "z-[1]" : "z-[2]"}`}>
            <Image src={src} alt="" fill sizes={sizes} className="object-contain drop-shadow-[0_10px_14px_rgba(107,13,17,.28)] transition-transform duration-700 ease-brand group-hover:scale-[1.07]" />
          </div>
        ))}
      </div>
    );
  }
  const src = imgSrc(item);
  // Deal photos (public/images/dealmenu) fill the whole tile; menu cut-outs sit inside it.
  if (src && item.category === "deals" && item.img) {
    return <Image src={src} alt={item.n} fill sizes={sizes} className="object-cover transition-transform duration-700 ease-brand group-hover:scale-[1.05]" />;
  }
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
