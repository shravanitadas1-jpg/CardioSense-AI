import { useEffect, useState } from "react";
import AnimatedCounter from "./AnimatedCounter";

const TONE_COLORS = {
  cyan: "#22D3EE",
  green: "#39FF9C",
  amber: "#FFB94A",
  red: "#FB7185",
  blue: "#3B82F6",
};

export default function CircularProgress({
  value,
  max = 100,
  label,
  unit = "",
  size = 148,
  stroke = 10,
  tone = "cyan",
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const dashOffset = circumference * (1 - (mounted ? pct : 0));
  const color = TONE_COLORS[tone] || TONE_COLORS.cyan;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)",
              filter: `drop-shadow(0 0 8px ${color}66)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-white">
            <AnimatedCounter value={value} />
            <span className="text-sm text-slate-400 ml-0.5">{unit}</span>
          </span>
        </div>
      </div>
      <p className="text-xs font-mono tracking-wide text-slate-400 text-center uppercase">
        {label}
      </p>
    </div>
  );
}