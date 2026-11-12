"use client";
import { useCallback, useEffect, useState } from "react";

// Browser side of Web Push: registers /sw.js, asks permission, and sends the subscription to the server.
// status: "unsupported" | "denied" | "off" | "on" | "busy"

const urlB64ToUint8 = (b64) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

export const pushSupported = () =>
  typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && window.isSecureContext;

async function registration() {
  return (await navigator.serviceWorker.getRegistration("/")) || navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

// key: what this browser follows, e.g. "admin" or "order:CX-ABC123" (remembered locally to show the right button state)
export default function usePush(key) {
  const [status, setStatus] = useState("off");
  const storeKey = `chixee.push.${key}`;

  useEffect(() => {
    // Browser-only checks, so they run after mount (the server render shows "off").
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!pushSupported()) return setStatus("unsupported");
    if (Notification.permission === "denied") return setStatus("denied");
    let on = false;
    try { on = localStorage.getItem(storeKey) === "1"; } catch {}
    if (!on || Notification.permission !== "granted") return setStatus("off");
    registration().then((r) => r.pushManager.getSubscription()).then((s) => setStatus(s ? "on" : "off")).catch(() => setStatus("off"));
  }, [storeKey]);

  // body: { role: "admin" } or { order: "CX-..." }
  const enable = useCallback(async (body) => {
    if (!pushSupported()) return setStatus("unsupported");
    setStatus("busy");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return setStatus(perm === "denied" ? "denied" : "off");
      const reg = await registration();
      await navigator.serviceWorker.ready;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        const { publicKey } = await fetch("/api/push/key").then((r) => r.json());
        sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64ToUint8(publicKey) });
      }
      const r = await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: sub.toJSON(), ...body }) });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "Couldn't turn on notifications");
      try { localStorage.setItem(storeKey, "1"); } catch {}
      setStatus("on");
      return true;
    } catch (e) {
      console.warn("[push]", e);
      setStatus("off");
      throw e;
    }
  }, [storeKey]);

  const disable = useCallback(async (body = {}) => {
    try {
      const reg = await registration();
      const sub = await reg.pushManager.getSubscription();
      if (sub) await fetch("/api/push/subscribe", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ endpoint: sub.endpoint, ...body }) });
    } catch {}
    try { localStorage.removeItem(storeKey); } catch {}
    setStatus("off");
  }, [storeKey]);

  return { status, enable, disable };
}
