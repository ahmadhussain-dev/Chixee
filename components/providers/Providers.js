"use client";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";

export default function Providers({ children }) {
  return (
    // No session refetch on every tab focus: one check on load is enough for this site.
    <SessionProvider refetchOnWindowFocus={false}>
      <ToastProvider>
        <LocationProvider>
          <CartProvider>{children}</CartProvider>
        </LocationProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
