"use client";
import { useEffect, useState } from "react";

// How many pixels of the footer are visible at the bottom of the screen.
// Floating buttons add this as bottom margin so they rest on top of the footer instead of covering it.
export default function useFooterGap() {
  const [gap, setGap] = useState(0);
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const footer = document.getElementById("site-footer");
      const next = footer ? Math.max(0, Math.round(window.innerHeight - footer.getBoundingClientRect().top)) : 0;
      setGap((g) => (g === next ? g : next));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    // The page can grow after mount (e.g. the order page swaps its loading skeleton for the order),
    // which moves the footer without any scroll, so measure again when the page's height changes.
    const ro = new ResizeObserver(onScroll);
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return gap;
}
