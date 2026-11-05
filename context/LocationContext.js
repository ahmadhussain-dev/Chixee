"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const KEY = "chixee.location.v1";
const LocCtx = createContext(null);
export const useLocation = () => useContext(LocCtx);

// location: { type: "delivery" | "pickup", city: "Faisalabad", area: { id, name, eta, fee } | null }
export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(null);
  const [ready, setReady] = useState(false);
  const [modalOpen, setModalOpenState] = useState(false);
  const [modalType, setModalType] = useState(null); // order type the popup opens on (null = the saved one)
  const setModalOpen = useCallback((open, type = null) => {
    setModalType(open ? type : null);
    setModalOpenState(open);
  }, []);
  const [areas, setAreas] = useState(null); // null = not loaded yet

  const setLocation = useCallback((loc) => {
    setLocationState(loc);
    try { localStorage.setItem(KEY, JSON.stringify(loc)); } catch {}
  }, []);

  const loadAreas = useCallback(async () => {
    try {
      const r = await fetch("/api/areas");
      const data = r.ok ? await r.json() : [];
      setAreas(data);
      return data;
    } catch {
      setAreas([]);
      return [];
    }
  }, []);

  // Restore the saved choice after mount (localStorage isn't available during server render),
  // then refresh the saved area's fee/ETA from the live list, or clear it if the area was removed.
  useEffect(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocationState(saved);
    setReady(true);
    if (saved?.type === "delivery" && saved.area) {
      loadAreas().then((list) => {
        if (!list.length) return;
        const fresh = list.find((a) => a.id === saved.area.id);
        if (!fresh) setLocation({ ...saved, area: null });
        else if (fresh.fee !== saved.area.fee || fresh.eta !== saved.area.eta) setLocation({ ...saved, area: fresh });
      });
    }
  }, [loadAreas, setLocation]);

  const setType = useCallback(
    (type) => {
      if (type === "delivery" && !location?.area) {
        setModalOpen(true, "delivery");
        return;
      }
      setLocation({ city: "Faisalabad", area: null, ...location, type });
    },
    [location, setLocation, setModalOpen]
  );

  const value = { location, ready, setLocation, setType, modalOpen, modalType, setModalOpen, areas, loadAreas };
  return <LocCtx.Provider value={value}>{children}</LocCtx.Provider>;
}
