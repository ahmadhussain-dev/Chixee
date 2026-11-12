"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IF_UNAVAILABLE, priceOf } from "@/lib/menu";
import { useCatalog } from "@/context/CatalogContext";

const KEY = "chixee.cart.v1";
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

// A line is one item + variation + special instructions; the same pizza with a different note is its own line.
const lineKey = (id, size, note = "") => [id, size || "", note || ""].join("|");
const keyOf = (l) => lineKey(l.id, l.size, l.note);


export function CartProvider({ children }) {
  const { ITEM_BY_ID } = useCatalog();
  // lines: [{ id, size, qty, note, ifUnavailable }]
  const [lines, setLines] = useState([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    try {
      // Restore the saved cart after mount (localStorage isn't available during server render).
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      // Drop anything no longer on the menu
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLines(saved.filter((l) => ITEM_BY_ID[l.id] && l.qty > 0));
    } catch {}
    setReady(true);
    // Only on first load; later menu changes are handled by `detailed` below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines, ready]);

  // Change the quantity of an existing cart line (0 removes it).
  const setLineQty = useCallback((key, qty) => {
    setLines((prev) =>
      qty <= 0 ? prev.filter((l) => keyOf(l) !== key) : prev.map((l) => (keyOf(l) === key ? { ...l, qty: Math.min(qty, 50) } : l))
    );
  }, []);

  // Add n of an item/variation; lines with the same item, variation and note are merged.
  const add = useCallback((id, size, n = 1, { note = "", ifUnavailable = "remove" } = {}) => {
    const clean = { id, size: size || null, note: String(note).trim().slice(0, 200), ifUnavailable: IF_UNAVAILABLE[ifUnavailable] ? ifUnavailable : "remove" };
    const k = keyOf(clean);
    setLines((prev) =>
      prev.some((l) => keyOf(l) === k)
        ? prev.map((l) => (keyOf(l) === k ? { ...l, ifUnavailable: clean.ifUnavailable, qty: Math.min(l.qty + n, 50) } : l))
        : [...prev, { ...clean, qty: Math.min(n, 50) }]
    );
    setBump((b) => b + 1);
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const item = ITEM_BY_ID[l.id];
          if (!item) return null;
          const price = priceOf(item, l.size);
          return { ...l, key: keyOf(l), item, price, total: price * l.qty };
        })
        .filter(Boolean),
    [lines, ITEM_BY_ID]
  );

  const count = detailed.reduce((s, l) => s + l.qty, 0);
  const subtotal = detailed.reduce((s, l) => s + l.total, 0);

  const value = { lines: detailed, count, subtotal, ready, setLineQty, add, clear, drawerOpen, setDrawerOpen, bump };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
