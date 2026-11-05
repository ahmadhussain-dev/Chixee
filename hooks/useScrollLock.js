"use client";
import { useEffect } from "react";

// Stops the page behind a popup or drawer from scrolling while `active` is true.
// Counted, so a popup opened on top of another (cart drawer → location popup) keeps the lock
// until the last one closes. Pads for the scrollbar it hides so the page doesn't jump sideways.
let locks = 0;
let saved = null;

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    if (locks++ === 0) {
      const gap = innerWidth - html.clientWidth;
      saved = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
      html.style.overflow = "hidden";
      if (gap > 0) html.style.paddingRight = `${gap}px`;
    }
    return () => {
      if (--locks === 0 && saved) {
        html.style.overflow = saved.overflow;
        html.style.paddingRight = saved.paddingRight;
        saved = null;
      }
    };
  }, [active]);
}
