"use client";
import { createContext, useContext, useMemo } from "react";
import { buildCatalog, SEED_RAW } from "@/lib/menu";

// The live menu and deals (from MongoDB, managed in the admin panel), handed down from the root layout.
const CatalogContext = createContext(null);

export function CatalogProvider({ raw, children }) {
  const catalog = useMemo(() => buildCatalog(raw || SEED_RAW), [raw]);
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export const useCatalog = () => useContext(CatalogContext) || buildCatalog(SEED_RAW);
