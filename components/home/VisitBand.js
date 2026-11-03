import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { IMAGES } from "@/data/images";
import { SITE } from "@/data/site";

export default function VisitBand() {
  return (
    <section aria-labelledby="visit-title" className="mt-20 grid overflow-hidden rounded-[28px] bg-yellow md:grid-cols-2">
      <div className="flex flex-col justify-center gap-3.5 p-7 text-maroon-dark md:p-11">
        <span className="eyebrow text-[26px] text-maroon">Dine in under the lights</span>
        <h2 id="visit-title" className="heading text-[clamp(32px,3.6vw,48px)]">Visit {SITE.name}</h2>
        <p className="max-w-[44ch]">Fairy-lit garden seating, fresh broast out of the fryer and a pot of chai on the table.</p>
        <div className="mt-1.5 flex items-start gap-3 rounded-2xl bg-white/55 px-4 py-3.5">
          <Icon name="pin" className="mt-0.5 size-[22px] flex-none text-maroon" />
          <div>
            <b className="block text-sm">{SITE.branch.name}</b>
            <span className="text-[13.5px]">{SITE.branch.address}</span>
          </div>
        </div>
      </div>
      <div className="relative min-h-[280px] md:aspect-[1200/1180]">
        {IMAGES.storefront ? (
          <Image src={IMAGES.storefront} alt="Chixee Broast storefront at night with the lit sign and fairy-light archway" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div role="img" aria-label="Chixee storefront photo coming soon" className="absolute inset-0 grid place-items-center bg-maroon">
            <Icon name="store" className="size-28 text-yellow/70" strokeWidth={1.4} />
          </div>
        )}
      </div>
    </section>
  );
}
