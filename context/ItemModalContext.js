"use client";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import ItemModal from "@/components/menu/ItemModal";
import { useCatalog } from "@/context/CatalogContext";

const Ctx = createContext({ openItem: () => {} });
export const useItemModal = () => useContext(Ctx);

// Lets any menu card (menu, popular items) open the item popup.
export function ItemModalProvider({ children }) {
  const { ITEM_BY_ID } = useCatalog();
  const [id, setId] = useState(null);
  const openItem = useCallback((itemId) => ITEM_BY_ID[itemId] && setId(itemId), [ITEM_BY_ID]);
  const close = useCallback(() => setId(null), []);
  const value = useMemo(() => ({ openItem }), [openItem]);
  return (
    <Ctx.Provider value={value}>
      {children}
      {id && ITEM_BY_ID[id] && <ItemModal key={id} item={ITEM_BY_ID[id]} onClose={close} />}
    </Ctx.Provider>
  );
}
