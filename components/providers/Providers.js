"use client";
import { SessionProvider } from "next-auth/react";
import { ToastProvider } from "@/context/ToastContext";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <LocationProvider>
          <CartProvider>{children}</CartProvider>
        </LocationProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
