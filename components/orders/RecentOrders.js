"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Package } from "lucide-react";
import { formatPKR } from "@/lib/menu";
import { getRecentOrders } from "@/lib/recent-orders";

const when = (d) => new Date(d).toLocaleString("en-PK", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// "Orders on this phone": every order placed or tracked on this device, so no one has to
// remember the order number. Shown on /track; renders nothing when the list is empty.
export default function RecentOrders() {
  const [list, setList] = useState([]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
  useEffect(() => setList(getRecentOrders()), []);
  if (!list.length) return null;
  return (
    <section id="recent" aria-labelledby="recent-h" className="mt-6 border-t border-line pt-5">
      <h2 id="recent-h" className="mb-2.5 text-sm font-bold">Orders on this phone</h2>
      <ul className="grid gap-2">
        {list.map((o) => (
          <li key={o.code}>
            <Link href={`/order/${o.code}`} className="flex items-center gap-3 rounded-xl bg-cream px-3 py-2.5 transition hover:bg-yellow-soft">
              <span className="grid size-9 flex-none place-items-center rounded-lg bg-white text-maroon"><Package aria-hidden="true" className="size-5" /></span>
              <span className="min-w-0 leading-tight">
                <b className="block tracking-wide">{o.code}</b>
                <small className="text-muted">{when(o.at)}{o.type ? ` · ${o.type === "pickup" ? "Pickup" : "Delivery"}` : ""}{o.total ? ` · ${formatPKR(o.total)}` : ""}</small>
              </span>
              <ChevronRight aria-hidden="true" className="ml-auto size-4 flex-none text-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
