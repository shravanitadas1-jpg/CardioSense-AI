import { useEffect, useState } from "react";

/**
 * Returns a live Date object that updates every second.
 */
export default function useClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}