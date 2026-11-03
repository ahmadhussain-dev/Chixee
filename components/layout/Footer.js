import Link from "next/link";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import SocialIcon, { SOCIAL_STYLE } from "@/components/ui/SocialIcon";
import { SITE } from "@/data/site";

function Row({ icon, social, tile, small, children, href }) {
  const body = (
    <>
      <span className={`grid size-[46px] flex-none place-items-center rounded-xl transition duration-300 group-hover:-rotate-[8deg] group-hover:scale-105 ${tile}`}>
        {social ? <SocialIcon name={social} /> : <Icon name={icon} className="size-[22px]" />}
      </span>
      <div className="min-w-0">
        <small className="block text-[12.5px] text-on-night-muted">{small}</small>
        <b className="font-semibold tabular-nums">{children}</b>
      </div>
    </>
  );
  return (
    <li className="group">
      {href ? (
        <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-3.5">{body}</a>
      ) : (
        <div className="flex items-center gap-3.5">{body}</div>
      )}
    </li>
  );
}

const SERVICE_TILE = "bg-maroon text-yellow group-hover:bg-yellow group-hover:text-maroon-dark";

export default function Footer() {
  return (
    <footer id="site-footer" className="bg-night text-on-night">
      <div className="wrap pb-7 pt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-4">
              <Logo size={84} variant="red" />
              <div>
                <b className="block font-display text-3xl font-normal leading-none text-yellow">{SITE.name}</b>
                <small className="font-script text-[22px] text-on-night-muted">{SITE.tagline}</small>
              </div>
            </div>
            <p className="my-4 max-w-[46ch] text-on-night-muted">
              Authentic injected broast, river fish, loaded pizzas and proper chai, made fresh in Faisalabad for dine-in, pickup and delivery.
            </p>
            <address className="flex items-start gap-2.5 text-sm not-italic">
              <Icon name="pin" className="mt-0.5 size-5 flex-none text-yellow" />
              {SITE.branch.address}
            </address>
            <div className="mt-5 flex gap-3" aria-label="Social media">
              {[["facebook", SITE.facebook, "Facebook"], ["instagram", SITE.instagram, "Instagram"], ["whatsapp", SITE.whatsapp, "WhatsApp"]].map(([k, href, label]) => (
                <a key={k} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Chixee on ${label}`} className={`grid size-11 place-items-center rounded-full transition hover:-translate-y-0.5 hover:scale-105 ${SOCIAL_STYLE[k]}`}>
                  <SocialIcon name={k} className="size-[22px]" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl font-normal">Contact Us</h2>
            <ul className="grid gap-3.5">
              <Row icon="phone" tile="bg-yellow text-maroon-dark" small="UAN" href="tel:111341111">{SITE.uan}</Row>
              <Row social="whatsapp" tile={SOCIAL_STYLE.whatsapp} small="Call / WhatsApp" href={SITE.whatsapp}>{SITE.phone}</Row>
              <Row social="facebook" tile={SOCIAL_STYLE.facebook} small="Facebook" href={SITE.facebook}>Chixee</Row>
              <Row social="instagram" tile={SOCIAL_STYLE.instagram} small="Instagram" href={SITE.instagram}>@chixee</Row>
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-display text-2xl font-normal">Services</h2>
            <ul className="grid gap-3.5">
              <Row icon="box" tile={SERVICE_TILE} small="Track Order" href="/track">Order Status</Row>
              <Row icon="bike" tile={SERVICE_TILE} small="Order Type">Delivery &amp; Pickup</Row>
              <Row icon="wallet" tile={SERVICE_TILE} small="Payment">Cash on Delivery / Bank Transfer</Row>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-5 text-[13.5px] text-on-night-muted">
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
