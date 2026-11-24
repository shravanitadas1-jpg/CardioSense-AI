import Navbar from "../components/Navbar";
import VitalsCard from "../components/VitalsCard";
import ECGChart from "../components/ECGChart";
import SensorStatus from "../components/SensorStatus";
import { useState } from "react";
import { saveReading } from "../services/api";

import {
  FaHeartbeat,
  FaTint,
  FaBrain,
  FaChartBar,
  FaBolt,
  FaBed,
} from "react-icons/fa";

import { useVitals } from "../context/VitalsContext";

const RECOVERY_TONE = {
  Excellent: "green",
  Good: "cyan",
  Moderate: "amber",
  Poor: "red",
};

export default function Dashboard() {
  const vitals = useVitals();

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  async function handleSaveReading() {
    try {
      setSaving(true);
      setSaveMessage("");

      await saveReading({
        heartRate: vitals.heartRate,
        spo2: vitals.spo2,
        temperature: vitals.temperature,
        cardiacAge: vitals.cardiacAge,
        ces: vitals.ces,
        recovery: vitals.recovery,
      });

      setSaveMessage("Reading saved successfully!");
    } catch (error) {
      console.error("Failed to save reading:", error);
      setSaveMessage("Failed to save reading.");
    } finally {
      setSaving(false);
    }
  }

  const cards = [
    {
      icon: FaHeartbeat,
      label: "Heart Rate",
      value: vitals.heartRate,
      unit: "bpm",
      tone: "green",
      trend: "Normal sinus rhythm",
    },
    {
      icon: FaTint,
      label: "SpO\u2082",
      value: vitals.spo2,
      unit: "%",
      tone: "cyan",
      trend: "Oxygen saturation stable",
    },
    {
      icon: FaBrain,
      label: "Cardiac Age",
      value: vitals.cardiacAge,
      unit: "yrs",
      tone: "blue",
      trend: "Better than chronological",
    },
    {
      icon: FaChartBar,
      label: "CES Score",
      value: vitals.ces,
      unit: "",
      tone: "cyan",
      trend: "Cardiac Enhancement Score",
    },
    {
      icon: FaBolt,
      label: "Stress",
      value: vitals.stress,
      unit: "",
      tone: "red",
      trend: "Lower is better",
    },
    {
      icon: FaBed,
      label: "Recovery",
      value: vitals.recovery,
      unit: "",
      tone: RECOVERY_TONE[vitals.recovery] || "cyan",
      trend: "Overall recovery status",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar title="Live Monitor" />

      <main className="p-4 md:p-8 space-y-6">

        {/* Save Reading */}
        <div className="flex items-center justify-end gap-4">
          {saveMessage && (
            <span className="text-sm text-slate-400">
              {saveMessage}
            </span>
          )}

          <button
            onClick={handleSaveReading}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40
                       text-cyan-300 hover:bg-cyan-500/30 transition
                       disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Reading"}
          </button>
        </div>

        {/* Vital Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {cards.map((c, i) => (
            <VitalsCard
              key={c.label}
              icon={c.icon}
              label={c.label}
              value={c.value}
              unit={c.unit}
              decimals={c.decimals}
              tone={c.tone}
              trend={c.trend}
              delay={i * 0.05}
            />
          ))}
        </div>

        {/* ECG + Sensor Status */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          <div className="xl:col-span-2 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-5">

            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold">
                  ECG Waveform
                </h2>

                <p className="text-xs text-slate-400">
                  Lead II AD8232 acquisition
                </p>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Updated {vitals.lastUpdated}
              </span>
            </div>

            <ECGChart height={220} live />

          </div>

          <SensorStatus
            connection={vitals.connection}
            sensor={vitals.sensor}
            lastUpdated={vitals.lastUpdated}
          />

        </div>

      </main>
    </div>
  );
}