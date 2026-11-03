"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ItemModal from "@/components/menu/ItemModal";
import { ITEM_BY_ID } from "@/data/menu";

const Ctx = createContext({ openItem: () => {} });
export const useItemModal = () => useContext(Ctx);

// Lets any menu card (menu, popular items) open the item popup.
export function ItemModalProvider({ children }) {
  const [id, setId] = useState(null);
  const openItem = useCallback((itemId) => ITEM_BY_ID[itemId] && setId(itemId), []);
  const close = useCallback(() => setId(null), []);
  const value = useMemo(() => ({ openItem }), [openItem]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {id && <ItemModal key={id} item={ITEM_BY_ID[id]} onClose={close} />}
    </Ctx.Provider>
  );
}
