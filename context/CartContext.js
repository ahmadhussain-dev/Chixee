"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ITEM_BY_ID, priceOf } from "@/data/menu";

const KEY = "chixee.cart.v1";
const CartCtx = createContext(null);
export const useCart = () => useContext(CartCtx);

const lineKey = (id, size) => (size ? `${id}|${size}` : id);

export function CartProvider({ children }) {
  // lines: [{ id, size, qty }]
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
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines, ready]);

  const qtyOf = useCallback(
    (id, size) => lines.find((l) => lineKey(l.id, l.size) === lineKey(id, size))?.qty || 0,
    [lines]
  );

  const setQty = useCallback((id, size, qty) => {
    setLines((prev) => {
      const k = lineKey(id, size);
      const rest = prev.filter((l) => lineKey(l.id, l.size) !== k);
      if (qty <= 0) return rest;
      const exists = prev.some((l) => lineKey(l.id, l.size) === k);
      const next = { id, size: size || null, qty: Math.min(qty, 50) };
      return exists ? prev.map((l) => (lineKey(l.id, l.size) === k ? next : l)) : [...prev, next];
    });
  }, []);

  const add = useCallback(
    (id, size, n = 1) => {
      setQty(id, size, qtyOf(id, size) + n);
      setBump((b) => b + 1);
    },
    [qtyOf, setQty]
  );

  const clear = useCallback(() => setLines([]), []);

  const detailed = useMemo(
    () =>
      lines
        .map((l) => {
          const item = ITEM_BY_ID[l.id];
          if (!item) return null;
          const price = priceOf(item, l.size);
          return { ...l, key: lineKey(l.id, l.size), item, price, total: price * l.qty };
        })
        .filter(Boolean),
    [lines]
  );

  const count = detailed.reduce((s, l) => s + l.qty, 0);
  const subtotal = detailed.reduce((s, l) => s + l.total, 0);

  const value = { lines: detailed, count, subtotal, ready, qtyOf, setQty, add, clear, drawerOpen, setDrawerOpen, bump };
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
