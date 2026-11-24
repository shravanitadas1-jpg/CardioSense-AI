import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa";

const STATUS_STYLES = {
  connected: { dot: "bg-emerald-400", text: "Connected", tone: "text-emerald-400" },
  connecting: { dot: "bg-amber-400", text: "Connecting", tone: "text-amber-400" },
  offline: { dot: "bg-rose-400", text: "Offline", tone: "text-rose-400" },
};

export default function SensorStatus({
  connection = "connected",
  sensor = "MAX30102 / AD8232",
  lastUpdated = "Just now",
}) {
  const status = STATUS_STYLES[connection] || STATUS_STYLES.connected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-5 flex flex-col gap-4"
    >
      <h2 className="font-semibold text-white">Sensor Status</h2>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Connection</span>
        <span className={`flex items-center gap-2 font-medium ${status.tone}`}>
          <span className={`w-2 h-2 rounded-full ${status.dot} animate-pulse`} />
          {status.text}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Sensor</span>
        <span className="text-white text-right">{sensor}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400 flex items-center gap-1">
          <FaClock size={12} /> Last Updated
        </span>
        <span className="text-white">{lastUpdated}</span>
      </div>
    </motion.div>
  );
}