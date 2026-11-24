import { useEffect, useMemo, useRef, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);

const WAVEFORM = [
  0, 0, 0, 0.02, -0.02, 0, 0.05, 0, -0.05, 0.1, 0, -0.15, 0.9, -0.35, 0.05,
  -0.05, 0.15, 0.25, 0.2, 0.1, 0, 0, 0, 0, 0.02, 0, -0.02, 0, 0, 0, 0.02,
  -0.02, 0, 0.05, 0, -0.05, 0.1, 0, -0.15, 0.95, -0.3, 0.05, -0.05, 0.18,
  0.28, 0.18, 0.08, 0, 0, 0, 0,
];

export default function ECGChart({ height = 220, live = true }) {
  const [offset, setOffset] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!live) return;
    const step = () => {
      setOffset((o) => (o + 1) % WAVEFORM.length);
      frame.current = setTimeout(step, 60);
    };
    frame.current = setTimeout(step, 60);
    return () => clearTimeout(frame.current);
  }, [live]);

  const rotated = useMemo(() => {
    const arr = [...WAVEFORM.slice(offset), ...WAVEFORM.slice(0, offset)];
    return arr;
  }, [offset]);

  const data = {
    labels: rotated.map((_, i) => i),
    datasets: [
      {
        data: rotated,
        borderColor: "#39FF9C",
        backgroundColor: "rgba(57,255,156,0.08)",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false, min: -0.6, max: 1.1 },
    },
    elements: { line: { capBezierPoints: true } },
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden border border-emerald-400/20 bg-black"
      style={{ height }}
    >
      <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[11px] font-mono tracking-widest text-emerald-400/80">
          ECG · LEAD II
        </span>
      </div>
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(57,255,156,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,156,0.15) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="absolute inset-0 pt-8 px-2 pb-2">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}