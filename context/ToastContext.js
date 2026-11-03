"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";

const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const [on, setOn] = useState(false);
  const timer = useRef();
  const toast = useCallback((m) => {
    setMsg(m);
    setOn(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOn(false), 2200);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-7 left-1/2 z-[90] flex max-w-[calc(100%-32px)] -translate-x-1/2 items-center gap-2.5 rounded-2xl bg-ink px-5 py-3 text-sm font-medium text-white shadow-[0_14px_34px_rgba(0,0,0,.25)] transition-all duration-500 ease-brand ${on ? "visible translate-y-0" : "invisible translate-y-[calc(100%+60px)]"}`}
      >
        <Icon name="check" className="size-5 flex-none text-yellow" />
        <span>{msg}</span>
      </div>
    </ToastCtx.Provider>
  );
}
