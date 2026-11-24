import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getHistory } from "../services/api";

const RECOVERY_TONE = {
  Excellent: "text-emerald-400",
  Good: "text-cyan-400",
  Moderate: "text-amber-400",
  Poor: "text-rose-400",
};

const AI_STATUS_TONE = {
  Normal: "text-emerald-400",
  Stable: "text-cyan-400",
  Warning: "text-amber-400",
  Critical: "text-rose-400",
};

export default function History() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const data = await getHistory();
        if (isMounted) setReadings(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError("Failed to load history.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar title="History" />

      <main className="p-4 md:p-8">
        <div className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-5">
          <div className="mb-5">
            <h2 className="font-semibold">Saved Readings</h2>
            <p className="text-xs text-slate-400">
              {loading ? "Loading records..." : `${readings.length} records`}
            </p>
          </div>

          {loading ? (
            <div className="py-16 flex items-center justify-center">
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                Fetching history...
              </div>
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-rose-400 text-sm mb-2">{error}</p>
              <p className="text-xs text-slate-400">
                Make sure the backend server is running on <span className="text-cyan-300">http://127.0.0.1:8000</span>
              </p>
            </div>
          ) : readings.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              No readings available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[820px]">
                <thead>
                  <tr className="text-left text-[11px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/10">
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Time</th>
                    <th className="py-3 pr-4">Heart Rate (BPM)</th>
                    <th className="py-3 pr-4">SpO\u2082 (%)</th>
                    <th className="py-3 pr-4">ECG</th>
                    <th className="py-3 pr-4">IR Value</th>
                    <th className="py-3 pr-4">CES</th>
                    <th className="py-3 pr-4">AI Status</th>
                    <th className="py-3 pr-4">Recovery</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.map((r, i) => (
                    <tr
                      key={r.id ?? i}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="py-3 pr-4 font-mono text-xs">{r.date ?? "\u2014"}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-400">{r.time ?? "\u2014"}</td>
                      <td className="py-3 pr-4">{r.heartRate ?? "\u2014"}</td>
                      <td className="py-3 pr-4">{r.spo2 ?? "\u2014"}</td>
                      <td className="py-3 pr-4">{r.ecg ?? "\u2014"}</td>
                      <td className="py-3 pr-4">{r.irValue ?? r.ir ?? "\u2014"}</td>
                      <td className="py-3 pr-4 font-mono">{r.ces ?? "\u2014"}</td>
                      <td
                        className={`py-3 pr-4 font-medium ${
                          AI_STATUS_TONE[r.aiStatus] || "text-slate-300"
                        }`}
                      >
                        {r.aiStatus ?? "\u2014"}
                      </td>
                      <td
                        className={`py-3 pr-4 font-medium ${
                          RECOVERY_TONE[r.recovery] || "text-slate-300"
                        }`}
                      >
                        {r.recovery ?? "\u2014"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}