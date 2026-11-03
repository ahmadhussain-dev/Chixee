"use client";
import { useEffect, useState } from "react";

const FIELDS = [
  ["bankName", "Bank name", "e.g. Meezan Bank"],
  ["accountTitle", "Account title", "e.g. Ahad Baig Food & Beverages"],
  ["accountNumber", "Account number", ""],
  ["iban", "IBAN", "PK00XXXX…"],
  ["jazzcashNumber", "JazzCash number", "03XX XXXXXXX"],
  ["jazzcashTitle", "JazzCash account name", ""],
];

export default function StoreSettings() {
  const [s, setS] = useState(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { fetch("/api/settings").then((r) => r.json()).then(setS); }, []);
  if (!s) return <div className="card h-64 animate-pulse" />;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s) });
        setMsg(r.ok ? "Saved." : "Couldn't save. Try again.");
        setTimeout(() => setMsg(""), 2500);
      }}
      className="grid max-w-2xl gap-5"
    >
      <h1 className="heading text-4xl">Payment &amp; store</h1>
      <section className="card grid gap-4 p-5">
        <h2 className="text-lg font-bold">Account transfer details</h2>
        <p className="-mt-2 text-sm text-muted">Shown on checkout when a customer picks “Account Transfer”. Leave everything empty to offer Cash on Delivery only.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map(([k, label, ph]) => (
            <label key={k} className="label">{label}<input value={s[k] || ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} placeholder={ph} className="input" /></label>
          ))}
        </div>
      </section>
      <section className="card flex items-center justify-between gap-4 p-5">
        <div><h2 className="text-lg font-bold">Accepting online orders</h2><p className="text-sm text-muted">Turn off when the kitchen is closed.</p></div>
        <input type="checkbox" checked={s.acceptingOrders} onChange={(e) => setS({ ...s, acceptingOrders: e.target.checked })} className="size-6 accent-maroon" aria-label="Accepting online orders" />
      </section>
      <div className="flex items-center gap-4"><button className="btn-maroon">Save changes</button>{msg && <span role="status" className="font-semibold text-green-700">{msg}</span>}</div>
    </form>
  );
}
