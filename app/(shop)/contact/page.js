import Icon from "@/components/ui/Icon";
import { SITE } from "@/data/site";

export const metadata = {
  title: "Contact us",
  description: `Call ${SITE.name} on UAN ${SITE.uan} or WhatsApp ${SITE.phone}. Kohinoor City, Faisalabad.`,
  alternates: { canonical: "/contact" },
};

const ROWS = [
  ["phone", "UAN", SITE.uan, "tel:111341111"],
  ["phone", "Call / WhatsApp", SITE.phone, `https://wa.me/${SITE.phoneIntl.replace("+", "")}`],
  ["fb", "Facebook", "Chixee", SITE.facebook],
  ["pin", SITE.branch.name, SITE.branch.address, null],
];

export default function ContactPage() {
  return (
    <main className="wrap max-w-3xl pb-28 pt-14">
      <span className="eyebrow text-3xl text-maroon">Say hello</span>
      <h1 className="heading mt-2 text-[clamp(40px,5vw,64px)]">Contact us</h1>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {ROWS.map(([icon, label, value, href]) => {
          const inner = (
            <>
              <span className="grid size-12 flex-none place-items-center rounded-xl bg-yellow text-maroon-dark"><Icon name={icon} className="size-6" /></span>
              <span><small className="block text-muted">{label}</small><b>{value}</b></span>
            </>
          );
          return (
            <li key={label}>
              {href ? <a href={href} className="card flex items-center gap-4 p-5 transition hover:-translate-y-0.5">{inner}</a> : <div className="card flex items-center gap-4 p-5">{inner}</div>}
            </li>
          );
        })}
      </ul>
    </main>
  );
}
