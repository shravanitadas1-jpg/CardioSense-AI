export function formatDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function statusColor(status) {
  switch (status) {
    case "connected":
    case "good":
    case "excellent":
    case "normal":
      return "text-emerald-400";
    case "connecting":
    case "moderate":
      return "text-amber-400";
    case "offline":
    case "poor":
    case "critical":
      return "text-rose-400";
    default:
      return "text-cyan-400";
  }
}

export function calculatePercentage(value, max) {
  if (!max || max <= 0) return 0;
  const pct = (value / max) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}