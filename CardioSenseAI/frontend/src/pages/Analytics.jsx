import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import CircularProgress from "../components/CircularProgress";
import { getAnalytics } from "../services/api";

function getClassificationTone(classification) {
  switch (classification) {
    case "Optimized":
    case "Excellent":
      return "text-emerald-400";

    case "Good":
      return "text-cyan-400";

    case "Moderate":
    case "Fair":
      return "text-amber-400";

    case "Poor":
    case "Critical":
      return "text-rose-400";

    default:
      return "text-slate-300";
  }
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAnalytics() {
      try {
        const data = await getAnalytics();

        if (!mounted) return;

        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load analytics:", err);

        if (mounted) {
          setError("Failed to load analytics.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAnalytics();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar title="Analytics" />

        <main className="p-4 md:p-8">
          <div className="py-20 flex justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              Loading analytics...
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar title="Analytics" />

        <main className="p-4 md:p-8">
          <div className="py-20 text-center text-rose-400">
            {error || "Analytics unavailable."}
          </div>
        </main>
      </div>
    );
  }

  const PRIMARY = [
    {
      key: "ces",
      label: "CES Score",
      value: analytics.ces ?? 0,
      max: 100,
      tone: "cyan",
    },
    {
      key: "stress",
      label: "Stress",
      value: analytics.stress ?? 0,
      max: 100,
      tone: "amber",
    },
    {
      key: "recovery",
      label: "Recovery",
      value: analytics.recovery ?? 0,
      max: 100,
      tone: "green",
    },
    {
      key: "cardiacAge",
      label: "Cardiac Age",
      value: analytics.cardiacAge ?? 0,
      max: 60,
      tone: "blue",
      unit: "yrs",
    },
  ];

  const SECONDARY = [
    {
      key: "spo2Stability",
      label: "SpO₂ Stability",
      value: analytics.spo2Stability ?? 0,
      max: 100,
      tone: "cyan",
    },
    {
      key: "ecgStability",
      label: "ECG Stability",
      value: analytics.ecgStability ?? 0,
      max: 100,
      tone: "green",
    },
    {
      key: "hrv",
      label: "HRV Score",
      value: analytics.hrv ?? 0,
      max: 100,
      tone: "blue",
    },
    {
      key: "activityBalance",
      label: "Activity Balance",
      value: analytics.activityBalance ?? 0,
      max: 100,
      tone: "amber",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar title="Analytics" />

      <main className="p-4 md:p-8 space-y-6">

        <div className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h2 className="font-semibold text-lg">
                Core Indicators
              </h2>

              <p className="text-xs text-slate-400">
                Calculated from {analytics.sampleSize ?? 0} saved reading(s)
              </p>
            </div>

            <span
              className={`self-start px-3 py-1.5 rounded-full text-xs font-mono bg-white/5 border border-white/10 ${getClassificationTone(
                analytics.classification
              )}`}
            >
              CES Classification: {analytics.classification ?? "Unknown"}
            </span>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRIMARY.map((m) => (
              <CircularProgress
                key={m.key}
                value={m.value}
                max={m.max}
                label={m.label}
                unit={m.unit || ""}
                tone={m.tone}
              />
            ))}
          </div>

        </div>

        <div className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6">

          <h2 className="font-semibold text-lg mb-6">
            Secondary Metrics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {SECONDARY.map((m) => (
              <CircularProgress
                key={m.key}
                value={m.value}
                max={m.max}
                label={m.label}
                unit=""
                tone={m.tone}
              />
            ))}
          </div>

        </div>

      </main>
    </div>
  );
}