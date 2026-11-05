"use client";
import { useEffect } from "react";

let bars = 0;

// A bar fixed at the bottom centre (live order bar, order-page actions) calls this while it shows.
// It sets html[data-bottom-bar], and globals.css turns that into --bottom-bar-h, which the cart,
// search and back-to-top buttons add to their bottom margin so they sit above the bar.
export default function useBottomBar(active) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    if (bars++ === 0) html.dataset.bottomBar = "";
    return () => {
      if (--bars === 0) delete html.dataset.bottomBar;
    };
  }, [active]);
}
