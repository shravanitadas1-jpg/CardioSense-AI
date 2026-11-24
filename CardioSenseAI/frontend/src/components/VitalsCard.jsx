import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

export default function VitalsCard({
  icon: Icon,
  label,
  value,
  unit = "",
  decimals = 0,
  tone = "cyan",
  trend,
  delay = 0,
}) {
  const isNumeric = typeof value === "number";

  const toneMap = {
    cyan: "text-cyan-400",
    green: "text-emerald-400",
    amber: "text-amber-400",
    blue: "text-blue-400",
    red: "text-rose-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-5 relative overflow-hidden group"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-cyan-400/5 blur-2xl group-hover:bg-cyan-400/10 transition-colors" />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-[11px] font-mono tracking-widest text-slate-400 uppercase">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl md:text-3xl font-semibold ${toneMap[tone]}`}>
              {isNumeric ? (
                <AnimatedCounter value={value} decimals={decimals} />
              ) : (
                value
              )}
            </span>
            {unit && <span className="text-sm text-slate-400">{unit}</span>}
          </div>
          {trend && <p className="mt-1 text-xs text-slate-500">{trend}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${toneMap[tone]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
    </motion.div>
  );
}