import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({ value, duration = 900, decimals = 0 }) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);
  const start = useRef(null);
  const from = useRef(0);

  useEffect(() => {
    from.current = display; // eslint-disable-line react-hooks/exhaustive-deps
    start.current = null;

    const step = (timestamp) => {
      if (start.current === null) start.current = timestamp;
      const progress = Math.min((timestamp - start.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from.current + (value - from.current) * eased;
      setDisplay(next);
      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
      }
    };

    frame.current = requestAnimationFrame(step);
    return () => frame.current && cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{display.toFixed(decimals)}</>;
}