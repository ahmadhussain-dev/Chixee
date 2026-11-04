import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import SocialIcon, { SOCIAL_STYLE } from "@/components/ui/SocialIcon";
import { SITE, formatTime } from "@/data/site";

const SOCIALS = [
  ["facebook", SITE.facebook, "Facebook"],
  ["instagram", SITE.instagram, "Instagram"],
  ["whatsapp", SITE.whatsapp, "WhatsApp"],
];

function Row({ icon, social, tile, small, children, href }) {
  const body = (
    <>
      <span className={`grid size-9 flex-none place-items-center rounded-[10px] transition duration-300 group-hover:-rotate-[8deg] group-hover:scale-105 sm:size-[46px] sm:rounded-xl ${tile}`}>
        {social ? <SocialIcon name={social} className="size-[18px] sm:size-[22px]" /> : <Icon name={icon} className="size-[18px] sm:size-[22px]" />}
      </span>
      <div className="min-w-0">
        <small className="block text-[11px] uppercase tracking-wide text-on-night-muted sm:text-[12.5px] sm:normal-case sm:tracking-normal">{small}</small>
        <b className="text-[13.5px] font-semibold leading-snug tabular-nums sm:text-base">{children}</b>
      </div>
    </>
  );
  return (
    <li className="group">
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-2.5 sm:gap-3.5">{body}</a>
      ) : (
        <div className="flex items-center gap-2.5 sm:gap-3.5">{body}</div>
      )}
    </li>
  );
}

const SERVICE_TILE = "bg-maroon text-yellow group-hover:bg-yellow group-hover:text-maroon-dark";

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-night text-on-night">
      <div className="wrap pb-6 pt-9 sm:pb-7 sm:pt-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:gap-10 lg:grid-cols-[1.25fr_1fr_1fr_1.2fr] lg:gap-8">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <Logo size={64} variant="red" />
              <div>
                <b className="block font-display text-[26px] font-normal leading-none text-yellow sm:text-3xl">{SITE.name}</b>
                <small className="font-script text-[19px] text-on-night-muted sm:text-[22px]">{SITE.tagline}</small>
              </div>
            </div>
            <p className="my-4 hidden max-w-[46ch] text-on-night-muted lg:block">
              Authentic injected broast, river fish, loaded pizzas and proper chai, made fresh in Faisalabad for dine-in, pickup and delivery.
            </p>
            <address className="mt-3 flex items-start gap-2.5 text-[13px] not-italic sm:text-sm lg:mt-0">
              <Icon name="pin" className="mt-0.5 size-5 flex-none text-yellow" />
              {SITE.branch.address}
            </address>
          </div>
          <div>
            <h2 className="mb-3 font-display text-lg font-normal sm:mb-4 sm:text-2xl">Contact Us</h2>
            <ul className="grid gap-2.5 sm:gap-3.5">
              <Row icon="phone" tile="bg-yellow text-maroon-dark" small="UAN" href="tel:111341111">{SITE.uan}</Row>
              <Row social="whatsapp" tile={SOCIAL_STYLE.whatsapp} small="WhatsApp" href={SITE.whatsapp}>{SITE.phone}</Row>
            </ul>
          </div>
          <div>
            <h2 className="mb-3 font-display text-lg font-normal sm:mb-4 sm:text-2xl">Services</h2>
            <ul className="grid gap-2.5 sm:gap-3.5">
              <Row icon="box" tile={SERVICE_TILE} small="Track Order" href="/track">Order Status</Row>
              <Row icon="bike" tile={SERVICE_TILE} small="Order Type">Delivery &amp; Pickup</Row>
              <Row icon="wallet" tile={SERVICE_TILE} small="Payment">Cash on Delivery / Bank Transfer</Row>
            </ul>
          </div>
          <div className="col-span-2 sm:grid sm:grid-cols-2 sm:gap-10 lg:col-span-1 lg:block">
            <div>
            <h2 className="mb-3 font-display text-lg font-normal sm:mb-4 sm:text-2xl">Our Timings</h2>
            <dl className="grid gap-1.5 text-[13.5px] sm:gap-2.5 sm:text-[15px]">
              {SITE.hours.map((h) => (
                <div key={h.label} className="flex items-baseline justify-between gap-3 lg:grid lg:gap-0.5 lg:border-b lg:border-white/10 lg:pb-2.5 lg:last:border-0">
                  <dt>{h.label}</dt>
                  <dd className="font-semibold tabular-nums text-yellow">{formatTime(h.opens)} - {formatTime(h.closes)}</dd>
                </div>
              ))}
            </dl>
            </div>
            <div>
            <h2 className="mb-2.5 mt-5 font-display text-lg font-normal sm:mb-4 sm:mt-0 sm:text-2xl lg:mb-3 lg:mt-6">Follow Us</h2>
            <div className="flex gap-3" aria-label="Social media">
              {SOCIALS.map(([k, href, label]) => (
                <a key={k} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Chixee on ${label}`} className="grid size-11 place-items-center rounded-xl bg-white/[.07] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-yellow sm:size-[52px] sm:rounded-2xl">
                  <span className={`grid size-8 place-items-center rounded-lg sm:size-9 sm:rounded-[10px] ${SOCIAL_STYLE[k]}`}>
                    <SocialIcon name={k} className="size-5" />
                  </span>
                </a>
              ))}
            </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-4 text-[12.5px] text-on-night-muted sm:mt-12 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4 sm:pt-5 sm:text-[13.5px]">
          <span>© {new Date().getFullYear()} {SITE.name} · A project of {SITE.company} · Faisalabad, Pakistan</span>
          <nav className="flex flex-wrap gap-6" aria-label="Footer">
            <Link href="/about" className="transition hover:text-yellow">About</Link>
            <Link href="/contact" className="transition hover:text-yellow">Contact</Link>
            <Link href="/track" className="transition hover:text-yellow">Track order</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
