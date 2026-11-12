"use client";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { CatalogProvider } from "@/context/CatalogContext";
import { LocationProvider } from "@/context/LocationContext";

export default function Providers({ catalog, children }) {
  return (
    // No session refetch on every tab focus: one check on load is enough for this site.
    <CatalogProvider raw={catalog}>
      <SessionProvider refetchOnWindowFocus={false}>
        <ToastProvider>
          <LocationProvider>
            <CartProvider>{children}</CartProvider>
          </LocationProvider>
        </ToastProvider>
      </SessionProvider>
    </CatalogProvider>
  );
}
