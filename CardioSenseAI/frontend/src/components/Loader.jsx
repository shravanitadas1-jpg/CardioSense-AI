import { motion } from "framer-motion";

export default function Loader({ label = "Loading", fullScreen = true }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-20 h-20">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-cyan-400/20"
        />
        <motion.span
          className="absolute inset-0 rounded-full border-t-2 border-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.span
          className="absolute inset-2 rounded-full border-b-2 border-cyan-400/50"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="w-2.5 h-2.5 rounded-full bg-cyan-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        </div>
      </div>

      <p className="font-mono text-xs tracking-[0.3em] text-cyan-400/80 uppercase">
        {label}
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          _
        </motion.span>
      </p>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      {content}
    </div>
  );
}