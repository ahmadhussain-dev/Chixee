"use client";
import { useEffect } from "react";

// Stops the page behind a popup or drawer from scrolling while `active` is true.
// `overflow: hidden` alone is ignored by touch scrolling in some phone browsers (Chrome on Android,
// older iOS Safari), so the body is pinned with position: fixed at the current scroll offset and put
// back where it was on unlock. Counted, so a popup on top of another (cart drawer → location popup)
// keeps the lock until the last one closes. Pads for the hidden scrollbar so desktop doesn't jump.
let locks = 0;
let saved = null;

export default function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;
    if (locks++ === 0) {
      const y = window.scrollY;
      const gap = innerWidth - html.clientWidth;
      saved = {
        y,
        html: html.getAttribute("style") || "",
        body: body.getAttribute("style") || "",
      };
      html.style.overflow = "hidden";
      html.style.overscrollBehavior = "none";
      Object.assign(body.style, { position: "fixed", top: `-${y}px`, left: "0", right: "0", width: "100%", overflow: "hidden" });
      if (gap > 0) body.style.paddingRight = `${gap}px`;
    }
    return () => {
      if (--locks === 0 && saved) {
        const { y } = saved;
        html.setAttribute("style", saved.html);
        body.setAttribute("style", saved.body);
        if (!saved.html) html.removeAttribute("style");
        if (!saved.body) body.removeAttribute("style");
        saved = null;
        // Jump straight back (no smooth scroll) to where the page was.
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";
        window.scrollTo(0, y);
        html.style.scrollBehavior = prev;
      }
    };
  }, [active]);
}
