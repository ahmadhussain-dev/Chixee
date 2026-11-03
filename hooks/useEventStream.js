"use client";
import { useEffect, useRef } from "react";

// Listens to a Server-Sent Events URL. The browser reconnects by itself if the connection drops;
// onOpen(isReconnect) runs on every connect; after a reconnect the page should reload to catch up on anything it missed.
export default function useEventStream(url, { onOrder, onOpen, onError }) {
  const handlers = useRef({ onOrder, onOpen, onError });
  useEffect(() => {
    handlers.current = { onOrder, onOpen, onError };
  });

  useEffect(() => {
    if (!url || typeof EventSource === "undefined") return;
    const es = new EventSource(url);
    let opened = false;
    es.onopen = () => {
      handlers.current.onOpen?.(opened);
      opened = true;
    };
    es.onerror = () => handlers.current.onError?.();
    es.addEventListener("order", (e) => {
      try { handlers.current.onOrder?.(JSON.parse(e.data)); } catch {}
    });
    return () => es.close();
  }, [url]);
}
