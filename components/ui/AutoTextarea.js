"use client";
import { useLayoutEffect, useRef } from "react";

// A textarea that starts one line tall, like the other inputs, and grows or shrinks with what's
// typed (up to `maxRows`, then it scrolls). Takes the same props as <textarea>.
export default function AutoTextarea({ className = "", maxRows = 8, value, ...props }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const cs = getComputedStyle(el);
    const line = parseFloat(cs.lineHeight) || 24;
    const border = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
    const max = line * maxRows + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + border;
    const full = el.scrollHeight + border; // border-box height that shows every line
    el.style.height = `${Math.min(full, max)}px`;
    el.style.overflowY = full > max + 1 ? "auto" : "hidden";
  }, [value, maxRows]);
  return <textarea ref={ref} rows={1} value={value} {...props} className={`${className} resize-none overflow-hidden`} />;
}
