"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Icon from "@/components/ui/Icon";
import ItemThumb from "@/components/menu/ItemThumb";
import QtyStepper from "@/components/ui/QtyStepper";
import PopularItems from "@/components/checkout/PopularItems";
import PhoneInput, { fromLocalDisplay, toLocalDisplay } from "@/components/checkout/PhoneInput";
import { FormError } from "@/components/auth/AuthCard";
import { useCart } from "@/context/CartContext";
import { useLocation } from "@/context/LocationContext";
import { formatPKR } from "@/data/menu";
import { SITE } from "@/data/site";

function Section({ title, action, children }) {
  return (
    <section className="rounded-2xl bg-cream/70 p-5 ring-1 ring-line sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function CheckoutForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { lines, subtotal, count, setLineQty, clear, ready: cartReady } = useCart();
  const { location, setModalOpen } = useLocation();
  const pickup = location?.type === "pickup";
  const area = !pickup ? location?.area : null;
  const fee = area?.fee || 0;

  const [form, setForm] = useState({ name: "", phone: "", email: "", altPhone: "", instructions: "", transactionId: "" });
  const [payment, setPayment] = useState("cod");
  const [bank, setBank] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({ open: false, label: "Home", line: "", save: true });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v?.target ? v.target.value : v }));

  // Prefill from the signed-in account (still editable).
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/me").then((r) => (r.ok ? r.json() : null)).then((me) => {
      if (!me) return;
      setForm((f) => ({ ...f, name: f.name || me.name, phone: f.phone || toLocalDisplay(me.phone), email: f.email || me.email }));
      setAddresses(me.addresses || []);
      if (me.addresses?.length) setAddressId(me.addresses[0].id);
    });
  }, [status]);

  useEffect(() => {
    fetch("/api/settings").then((r) => (r.ok ? r.json() : null)).then(setBank).catch(() => {});
  }, []);

  const hasTransfer = bank && (bank.accountNumber || bank.iban || bank.jazzcashNumber);
  const showNewAddress = newAddress.open || !addresses.length;
  const chosenAddress = showNewAddress ? newAddress.line : addresses.find((a) => a.id === addressId)?.line || "";

  async function placeOrder() {
    setError("");
    if (!pickup && !area) { setModalOpen(true); return setError("Please choose your delivery area first."); }
    if (!pickup && chosenAddress.trim().length < 5) return setError("Please enter your full delivery address.");
    setBusy(true);
    try {
      if (session && !pickup && showNewAddress && newAddress.save && newAddress.line.trim()) {
        await fetch("/api/me", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", label: newAddress.label, line: newAddress.line, area: area?.name }) });
      }
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: pickup ? "pickup" : "delivery",
          name: form.name,
          phone: fromLocalDisplay(form.phone),
          altPhone: fromLocalDisplay(form.altPhone),
          email: form.email,
          areaId: area?.id,
          address: chosenAddress,
          instructions: form.instructions,
          paymentMethod: payment,
          transactionId: form.transactionId,
          items: lines.map((l) => ({ id: l.id, size: l.size, qty: l.qty, note: l.note, ifUnavailable: l.ifUnavailable })),
        }),
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || "Couldn't place your order.");
      clear();
      router.push(`/order/${data.code}?new=1`);
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  if (cartReady && !count) {
    return (
      <div className="card mx-auto my-10 grid max-w-md place-items-center gap-3 p-10 text-center">
        <Icon name="bag" className="size-16 animate-float text-yellow" />
        <h1 className="heading text-3xl">Your cart is empty</h1>
        <p className="text-muted">Add something tasty from the menu first.</p>
        <Link href="/#menu" className="btn-yellow">Browse the menu</Link>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); placeOrder(); }} className="grid grid-cols-[minmax(0,1fr)] items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* Left: customer details */}
      <div className="grid min-w-0 grid-cols-1 gap-5 rounded-3xl bg-white p-5 shadow-[0_0_0_1px_var(--color-line)] sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <label className="label text-base font-medium">Full Name<input required value={form.name} onChange={set("name")} autoComplete="name" placeholder="Enter your name" className="input" /></label>
          <div className="label text-base font-medium">
            <label htmlFor="phone">Mobile Number</label>
            <PhoneInput id="phone" required value={form.phone} onChange={set("phone")} />
            <small className="text-[13px] font-normal text-muted">Example: +92 3XX-XXXXXXX</small>
          </div>
          <label className="label text-base font-medium">
            <span>Email Address <span className="font-normal text-muted">(Optional)</span></span>
            <input type="email" value={form.email} onChange={set("email")} autoComplete="email" placeholder="Enter your email address" className="input" />
          </label>
          <div className="label text-base font-medium">
            <label htmlFor="alt">Alternative phone number <span className="font-normal text-muted">(Optional)</span></label>
            <PhoneInput id="alt" value={form.altPhone} onChange={set("altPhone")} />
            <small className="text-[13px] font-normal text-muted">Example: +92 3XX-XXXXXXX</small>
          </div>
        </div>

        {pickup ? (
          <Section title="Pickup from" action={<button type="button" onClick={() => setModalOpen(true)} className="text-sm font-semibold text-maroon underline">Switch to delivery</button>}>
            <div className="flex items-start gap-3 rounded-xl bg-white p-4 ring-1 ring-line">
              <Icon name="store" className="mt-0.5 size-6 flex-none text-maroon" />
              <div><b className="block">{SITE.branch.name} branch</b><span className="text-sm text-muted">{SITE.branch.address}</span></div>
            </div>
          </Section>
        ) : (
          <Section
            title="Your Address"
            action={
              addresses.length > 0 && (
                <button type="button" onClick={() => setNewAddress((n) => ({ ...n, open: !n.open }))} className="btn-maroon px-5 py-2.5">
                  <Icon name={newAddress.open ? "x" : "plus"} className="size-[18px]" />
                  {newAddress.open ? "Use saved address" : "Add new Address"}
                </button>
              )
            }
          >
            <button type="button" onClick={() => setModalOpen(true)} className="mb-4 flex w-full items-center gap-2.5 rounded-xl bg-yellow-soft px-4 py-3 text-left text-sm text-maroon-dark">
              <Icon name="pin" className="size-5 flex-none" />
              <span className="flex-1">{area ? <>Area: <b>{area.name}</b> · about {area.eta} min · delivery {formatPKR(area.fee)}</> : <b>Choose your delivery area</b>}</span>
              <span className="font-semibold underline">Change</span>
            </button>

            {!showNewAddress ? (
              <div className="grid gap-2.5" role="radiogroup" aria-label="Saved addresses">
                {addresses.map((a) => (
                  <label key={a.id} className={`flex cursor-pointer items-start gap-3 rounded-xl bg-white p-4 ring-1 transition ${addressId === a.id ? "ring-2 ring-yellow" : "ring-line"}`}>
                    <input type="radio" name="addr" checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-1 accent-maroon" />
                    <span><b className="block text-sm">{a.label}{a.area ? ` · ${a.area}` : ""}</b><span className="text-sm text-muted">{a.line}</span></span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid gap-3">
                {status !== "authenticated" && addresses.length === 0 && <p className="rounded-xl bg-white/70 px-4 py-3 text-sm text-muted ring-1 ring-line">You don&apos;t have a saved address. <Link href="/login?next=/checkout" className="font-semibold text-maroon">Sign in</Link> to save addresses, or enter it below.</p>}
                <label className="label">Full address<textarea required rows={3} value={newAddress.line} onChange={(e) => setNewAddress((n) => ({ ...n, line: e.target.value }))} placeholder="House #, street, block, nearest landmark" className="input resize-y" /></label>
                {status === "authenticated" && (
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="label flex-1">Label<input value={newAddress.label} onChange={(e) => setNewAddress((n) => ({ ...n, label: e.target.value }))} placeholder="Home, Office…" className="input" /></label>
                    <label className="mt-5 flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={newAddress.save} onChange={(e) => setNewAddress((n) => ({ ...n, save: e.target.checked }))} className="size-4 accent-maroon" />Save to my account</label>
                  </div>
                )}
              </div>
            )}
          </Section>
        )}

        <Section title="Special Instructions">
          <textarea rows={3} value={form.instructions} onChange={set("instructions")} maxLength={500} placeholder="E.g. extra spicy garlic, no onions, call on arrival, gate code…" className="input resize-y" />
        </Section>

        <Section title="Payment Method">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["cod", "wallet", pickup ? "Cash at counter" : "Cash on Delivery", "Pay when you get your food"],
              ["transfer", "phone", "Account Transfer", hasTransfer ? "Bank / JazzCash, then enter transaction ID" : "Not available yet"],
            ].map(([k, icon, label, sub]) => (
              <label key={k} className={`flex items-center gap-3 rounded-xl bg-white p-4 ring-1 transition ${k === "transfer" && !hasTransfer ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${payment === k ? "ring-2 ring-yellow" : "ring-line"}`}>
                <input type="radio" name="payment" value={k} disabled={k === "transfer" && !hasTransfer} checked={payment === k} onChange={() => setPayment(k)} className="accent-maroon" />
                <Icon name={icon} className="size-6 flex-none text-maroon" />
                <span><b className="block text-sm">{label}</b><span className="text-xs text-muted">{sub}</span></span>
              </label>
            ))}
          </div>
          {payment === "transfer" && hasTransfer && (
            <div className="mt-4 grid gap-3 rounded-xl bg-white p-4 ring-1 ring-line">
              <p className="text-sm">Send <b>{formatPKR(subtotal + fee)}</b> to one of these accounts, then enter the transaction ID. We&apos;ll confirm it before preparing your order.</p>
              <dl className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {bank.bankName && <><dt className="text-muted">Bank</dt><dd className="font-semibold">{bank.bankName}</dd></>}
                {bank.accountTitle && <><dt className="text-muted">Account title</dt><dd className="font-semibold">{bank.accountTitle}</dd></>}
                {bank.accountNumber && <><dt className="text-muted">Account number</dt><dd className="font-semibold tabular-nums">{bank.accountNumber}</dd></>}
                {bank.iban && <><dt className="text-muted">IBAN</dt><dd className="break-all font-semibold">{bank.iban}</dd></>}
                {bank.jazzcashNumber && <><dt className="text-muted">JazzCash</dt><dd className="font-semibold tabular-nums">{bank.jazzcashNumber}{bank.jazzcashTitle ? ` (${bank.jazzcashTitle})` : ""}</dd></>}
              </dl>
              <label className="label">Transaction ID<input required value={form.transactionId} onChange={set("transactionId")} placeholder="e.g. 0123456789" className="input" /></label>
            </div>
          )}
        </Section>
      </div>

      {/* Right: cart summary + place order */}
      <aside className="overflow-hidden rounded-3xl bg-white shadow-[0_0_0_1px_var(--color-line)] lg:sticky lg:top-4">
        <h2 className="border-b border-line bg-cream px-6 py-5 text-2xl font-bold">Your Cart</h2>
        <div className="px-5 py-4">
          <div className="grid gap-4">
            {lines.map((l) => (
              <div key={l.key} className="grid grid-cols-[72px_1fr] gap-3 border-b border-line pb-4">
                <div className="relative size-[72px] overflow-hidden rounded-xl bg-yellow"><ItemThumb item={l.item} small sizes="72px" /></div>
                <div className="min-w-0">
                  <b className="block leading-tight">{l.item.n}{l.size ? ` (${l.size})` : ""}</b>
                  <p className="line-clamp-2 text-sm text-muted">{l.item.d}</p>
                  {l.note && <p className="mt-0.5 text-sm italic text-maroon">Note: {l.note}</p>}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <QtyStepper small qty={l.qty} onChange={(q) => setLineQty(l.key, q)} />
                    <b className="tabular-nums">{formatPKR(l.total)}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center"><Link href="/#menu" className="font-semibold text-maroon underline underline-offset-4">+ Add more items</Link></p>

          <PopularItems />

          <div className="mt-6 grid gap-2 border-t border-line pt-4 tabular-nums">
            <div className="flex justify-between text-sm text-muted"><span>Subtotal</span><span>{formatPKR(subtotal)}</span></div>
            {!pickup && <div className="flex justify-between text-sm text-muted"><span>Delivery fee</span><span>{area ? formatPKR(fee) : "Choose area"}</span></div>}
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPKR(subtotal + fee)}</span></div>
          </div>
          <div className="mt-4 grid gap-3">
            <FormError>{error}</FormError>
            <button type="submit" disabled={busy || !count} className="btn-maroon w-full py-4 text-base">
              {busy ? "Placing order…" : `Place Order · ${formatPKR(subtotal + fee)}`}
            </button>
            {!session && status !== "loading" && <p className="text-center text-xs text-muted">Ordering as a guest. <Link href="/login?next=/checkout" className="font-semibold text-maroon">Sign in</Link> to autofill your details.</p>}
          </div>
        </div>
      </aside>
    </form>
  );
}
