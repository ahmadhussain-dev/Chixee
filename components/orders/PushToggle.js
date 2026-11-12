"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import usePush from "@/hooks/usePush";

// "Turn on notifications" card. Admin: every new order. Customer: updates for one order.
export function AdminPushToggle() {
  const { status, enable, disable } = usePush("admin");
  const [err, setErr] = useState("");
  if (status === "unsupported") return null;
  const on = status === "on";
  return (
    <div className={`mb-5 flex flex-wrap items-center gap-3 rounded-2xl p-4 ring-1 ${on ? "bg-green-50 ring-green-200" : "bg-yellow-soft ring-yellow"}`}>
      <Icon name={on ? "check" : "phone"} className="size-6 flex-none text-maroon" />
      <p className="min-w-0 flex-1 text-sm">
        {on ? <><b>New-order alerts are on</b> for this device, even when the admin panel is closed.</>
          : status === "denied" ? <><b>Notifications are blocked</b> for this site. Allow them in the browser&apos;s site settings, then reload.</>
          : <><b>Get a notification for every new order</b> on this phone, even when the admin panel is closed.</>}
        {err && <span className="mt-1 block text-maroon">{err}</span>}
      </p>
      {status !== "denied" && (
        <button type="button" disabled={status === "busy"} onClick={async () => { setErr(""); try { on ? await disable({ role: "admin" }) : await enable({ role: "admin" }); } catch (e) { setErr(e.message); } }}
          className={`${on ? "btn-outline" : "btn-maroon"} px-4 py-2 text-sm disabled:opacity-50`}>
          {status === "busy" ? "Turning on…" : on ? "Turn off" : "Turn on alerts"}
        </button>
      )}
    </div>
  );
}

export function OrderPushPrompt({ code }) {
  const { status, enable } = usePush(`order:${code}`);
  const [err, setErr] = useState("");
  if (status === "unsupported" || status === "denied") return null;
  if (status === "on") {
    return <p className="flex items-center gap-2 rounded-2xl bg-green-50 p-4 text-sm text-green-900 ring-1 ring-green-200"><Icon name="check" className="size-5 flex-none" />We&apos;ll send a notification to this phone when your order is accepted and when it&apos;s on the way.</p>;
  }
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-yellow-soft p-4 ring-1 ring-yellow">
      <Icon name="phone" className="size-6 flex-none text-maroon" />
      <p className="min-w-0 flex-1 text-sm"><b>Get notified</b> when the restaurant accepts your order, so you don&apos;t have to keep this page open.{err && <span className="mt-1 block text-maroon">{err}</span>}</p>
      <button type="button" disabled={status === "busy"} onClick={async () => { setErr(""); try { await enable({ order: code }); } catch (e) { setErr(e.message); } }} className="btn-maroon px-4 py-2 text-sm disabled:opacity-50">
        {status === "busy" ? "Turning on…" : "Notify me"}
      </button>
    </div>
  );
}
