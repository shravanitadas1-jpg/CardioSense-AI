import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FingerprintScanner from "../components/FingerprintScanner";
import LoadingSequence, { STAGES } from "../components/LoadingSequence";
import { FaHeartbeat } from "react-icons/fa";

const TOTAL_MS = 4000;

export default function Landing() {
  const navigate = useNavigate();
  const [started, setStarted] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [age, setAge] = useState("");
  const [ageError, setAgeError] = useState("");

  useEffect(() => {
    if (!started) return;

    const stepMs = TOTAL_MS / STAGES.length;
    const stageTimer = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, stepMs);

    const redirectTimer = setTimeout(() => {
      navigate("/dashboard");
    }, TOTAL_MS);

    return () => {
      clearInterval(stageTimer);
      clearTimeout(redirectTimer);
    };
  }, [started, navigate]);

  return (
    <div className="min-h-screen bg-void grid-backdrop bg-radial-glow flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 mb-10"
      >
        <FaHeartbeat className="text-cyan-glow" size={20} />
        <span className="font-mono text-xs tracking-[0.3em] text-ink-muted uppercase">
          Cardiovascular Replica Analytics Engine
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-glow"
      >
        CardioSense <span className="text-cyan-glow">AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mt-4 text-ink-muted max-w-md"
      >
        {started
          ? "Hold still while we build your cardiac twin."
          : "Place your finger on the sensor and enter your age below"}
      </motion.p>

      {!started && (
        <div className="relative mt-6 w-full max-w-xs mx-auto z-10">
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(event) => {
              setAge(event.target.value);
              if (ageError && event.target.value.trim()) {
                setAgeError("");
              }
            }}
            placeholder="Enter your age"
            className={`w-full rounded-3xl border ${ageError ? "border-red-400/70" : "border-cyan-400/40"} bg-slate-950/70 px-4 py-3 text-white placeholder:text-slate-500 shadow-[0_0_30px_-12px_rgba(34,211,238,0.45)] focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/20 caret-cyan-400 cursor-text`}
          />
          {ageError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-left text-sm text-red-400/90 font-medium"
            >
              Field required
            </motion.p>
          )}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="my-12"
      >
        <FingerprintScanner scanning={started} size={240} />
      </motion.div>

      <div className="h-10 flex items-center justify-center">
        {started ? (
          <LoadingSequence stageIndex={stageIndex} />
        ) : (
          <button
            onClick={() => {
              if (!age.trim()) {
                setAgeError("Field required");
                return;
              }

              setAgeError("");
              setStarted(true);
            }}
            className="px-8 py-3 rounded-full glass shadow-glow-sm font-medium text-sm tracking-wide text-cyan-glow hover:shadow-glow transition-shadow"
          >
            Start Monitoring
          </button>
        )}
      </div>

      {started && (
        <div className="w-64 h-1 rounded-full bg-white/5 mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-cyan-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: TOTAL_MS / 1000, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
}