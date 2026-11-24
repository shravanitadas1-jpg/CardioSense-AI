import { AnimatePresence, motion } from "framer-motion";

export const STAGES = [
  "Initializing Sensors",
  "Reading Heart Signals",
  "Analyzing ECG",
  "Building Cardiac Twin",
  "Launching Dashboard",
];

export default function LoadingSequence({ stageIndex = 0 }) {
  const activeIndex = Math.min(stageIndex, STAGES.length - 1);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs">
      <div className="h-7 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-sm tracking-wide text-cyan-glow/90"
          >
            {STAGES[activeIndex]}
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              _
            </motion.span>
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2 w-full">
        {STAGES.map((stage, i) => {
          const isActive = i === activeIndex;
          const isComplete = i < activeIndex;
          return (
            <div key={stage} className="flex-1 flex flex-col items-center gap-2">
              <motion.span
                className={`w-2 h-2 rounded-full ${
                  isActive
                    ? "bg-cyan-glow shadow-glow-sm"
                    : isComplete
                    ? "bg-cyan-glow/60"
                    : "bg-white/10"
                }`}
                animate={
                  isActive
                    ? { scale: [1, 1.5, 1] }
                    : { scale: 1 }
                }
                transition={
                  isActive
                    ? { duration: 1, repeat: Infinity }
                    : { duration: 0.3 }
                }
              />
              <div className="h-0.5 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-glow"
                  initial={{ width: "0%" }}
                  animate={{
                    width: isComplete ? "100%" : isActive ? "100%" : "0%",
                  }}
                  transition={{
                    duration: isActive ? 0.8 : 0.3,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}