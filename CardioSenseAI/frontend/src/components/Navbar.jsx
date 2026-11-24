import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaHeartbeat } from "react-icons/fa";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/history", label: "History" },
  { to: "/analytics", label: "Analytics" },
  { to: "/assistant", label: "AI Assistant" },
];

export default function Navbar({ title = "CardioSense AI" }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-4 md:px-8 h-16 bg-slate-900/60 border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center text-cyan-400"
        >
          <FaHeartbeat size={16} />
        </motion.div>
        <h1 className="font-semibold tracking-tight text-white">{title}</h1>
      </div>

      <nav className="flex items-center gap-2">
        {LINKS.map((link) => {
          const active = location.pathname === link.to;
          return (
            <button
              key={link.to}
              onClick={() => navigate(link.to)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "text-cyan-400 border-cyan-400/40 bg-cyan-400/10"
                  : "text-slate-300 border-white/10 bg-white/5 hover:text-cyan-400 hover:border-cyan-400/40"
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}