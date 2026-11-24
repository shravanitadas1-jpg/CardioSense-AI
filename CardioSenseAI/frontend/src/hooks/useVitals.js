import { useEffect, useState } from "react";
import { useVitals as useVitalsContext } from "../context/VitalsContext";

/**
 * Wraps the VitalsContext hook and exposes a short-lived loading state
 * so consumers can show a skeleton/loader on first mount.
 */
export default function useVitals() {
  const vitals = useVitalsContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return { vitals, loading };
}