import { motion } from "framer-motion";

export default function FingerprintScanner({ scanning = true, size = 220 }) {
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <span className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" />
      <span
        className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping"
        style={{ animationDelay: "0.4s" }}
      />
      <span
        className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping"
        style={{ animationDelay: "0.8s" }}
      />

      <div className="relative w-[78%] h-[78%] rounded-full bg-slate-900/60 border border-white/10 backdrop-blur-xl shadow-[0_0_40px_-8px_rgba(34,211,238,0.35)] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-[55%] h-[55%] text-cyan-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <path d="M50 20c-13 0-22 10-22 24 0 8 2 14 4 19" opacity="0.9" />
          <path d="M50 14c-18 0-30 13-30 30 0 10 2 18 5 25" opacity="0.75" />
          <path d="M50 27c-9 0-15 7-15 17 0 10 3 17 7 23" opacity="0.9" />
          <path d="M50 34c-6 0-10 5-10 10 0 11 4 19 10 26" opacity="1" />
          <path d="M50 41c-3 0-5 2-5 5 0 12 5 20 12 27" opacity="0.85" />
          <path d="M50 8c-23 0-38 16-38 36 0 12 3 21 7 29" opacity="0.5" />
        </svg>

        {scanning && (
          <motion.div
            className="absolute left-0 right-0 h-10 bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent"
            initial={{ top: "-10%" }}
            animate={{ top: ["-10%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </div>
    </div>
  );
}