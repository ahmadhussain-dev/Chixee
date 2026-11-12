"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { Bone, Loading } from "@/components/ui/Skeleton";
import useScrollLock from "@/hooks/useScrollLock";
import { fresh } from "@/lib/menu";

// Pieces shared by the admin Menu items and Deals pages.

export async function api(url, method = "GET", body) {
  const r = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(d.error || `Request failed (${r.status})`);
  return d;
}

// Small square photo on the brand-yellow tile (same look as the shop).
export function Thumb({ src, glyph, className = "size-14" }) {
  return (
    <div className={`relative flex-none overflow-hidden rounded-xl bg-yellow ${className}`}>
      {src ? <Image src={fresh(src)} alt="" fill sizes="64px" className="object-contain p-1" /> : <span className="absolute inset-0 grid place-items-center text-maroon"><Icon name={glyph || "box"} className="size-6" /></span>}
    </div>
  );
}

export function Switch({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-none rounded-full transition ${checked ? "bg-green-600" : "bg-line"}`}>
      <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`} />
    </button>
  );
}

// Popup editor: bottom sheet on phones, centred card on bigger screens.
export function Sheet({ title, onClose, children, footer }) {
  useScrollLock(true);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 sm:items-center sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-cream shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <h2 className="heading text-2xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full hover:bg-cream"><Icon name="x" /></button>
        </div>
        <div className="grid grid-cols-1 gap-4 overflow-y-auto overscroll-contain p-5">{children}</div>
        {footer && <div className="border-t border-line bg-white px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}

// Photo picker: uploads to Vercel Blob through /api/admin/upload and hands back the URL.
export function PhotoField({ value, onChange, name, glyph }) {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const upload = async (file) => {
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("name", name || "photo");
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Upload failed.");
      onChange(d.url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <div className="grid gap-1.5 text-[13px] font-semibold">
      Photo
      <div className="flex items-center gap-3">
        <Thumb src={value} glyph={glyph} className="size-20" />
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => input.current?.click()} className="btn-outline px-4 py-2 text-sm disabled:opacity-50">
              {busy ? "Uploading…" : value ? "Change photo" : "Upload photo"}
            </button>
            {value && <button type="button" onClick={() => onChange("")} className="rounded-full px-3 py-2 text-sm text-maroon hover:bg-red-50">Remove</button>}
          </div>
          <p className="text-xs font-normal text-muted">PNG or WebP with a see-through background looks best on the yellow tile. Up to 4 MB.</p>
        </div>
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden onChange={(e) => upload(e.target.files?.[0])} />
      {err && <p className="text-xs font-normal text-maroon">{err}</p>}
    </div>
  );
}

export function RowsSkeleton({ rows = 6, label = "Loading" }) {
  return (
    <Loading label={label} className="card overflow-hidden">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-3 border-t border-line p-3 first:border-t-0">
          <Bone className="size-14 rounded-xl" tone="y" />
          <div className="grid flex-1 gap-2"><Bone className="h-4 w-1/2" /><Bone className="h-3 w-1/3" /></div>
          <Bone className="h-7 w-12 rounded-full" />
          <Bone className="size-9 rounded-lg" />
        </div>
      ))}
    </Loading>
  );
}

export function ErrorNote({ children }) {
  return children ? <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-maroon">{children}</p> : null;
}
