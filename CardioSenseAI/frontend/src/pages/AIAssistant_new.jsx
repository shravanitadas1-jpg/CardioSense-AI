import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaHeartbeat, FaUser, FaClock, FaTrash } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import Navbar from "../components/Navbar";
import { useVitals } from "../context/VitalsContext";
import { getAnalytics } from "../services/api";

const QUICK_SUGGESTIONS = [
  { text: "Analyze my health", icon: "📊" },
  { text: "Explain CES", icon: "📚" },
  { text: "Is my heart rate normal?", icon: "❤️" },
  { text: "Recovery tips", icon: "💪" },
  { text: "Stress reduction", icon: "🧘" },
  { text: "My reminders", icon: "🔔" },
];

const HEALTH_TERMS = {
  "heart rate": "Heart rate is the number of times your heart beats per minute (bpm). Normal resting heart rate for adults is 60-100 bpm. Lower resting heart rate often indicates better cardiovascular fitness.",
  ecg: "ECG (Electrocardiogram) measures the electrical activity of your heart. It helps detect irregular rhythms, rate, and other cardiac conditions.",
  spo2: "SpO₂ (Oxygen Saturation) is the percentage of oxygen in your blood. Normal range is 95-100%. Below 90% may indicate a problem and requires medical attention.",
  ces: "CES (Cardiac Enhancement Score) measures your overall cardiovascular stability and recovery. Scores above 80 indicate optimized cardiovascular performance.",
  stress: "Stress level is derived from your vital readings. High stress can affect heart rate, blood pressure, and recovery. Managing stress through breathing, exercise, and sleep helps.",
  recovery: "Recovery indicates how well your body has recovered from previous exertion. Poor recovery suggests you need more rest; excellent recovery means you're ready for more activity.",
  "cardiac age": "Cardiac age is an estimate of your heart's biological age based on your cardiovascular metrics. It can be different from your chronological age and improves with healthy habits.",
  hrv: "HRV (Heart Rate Variability) measures variation in time between heartbeats. Higher HRV typically indicates better health, fitness, and stress resilience.",
};

export default function AIAssistant() {
  const vitals = useVitals();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, I'm your CardioSense AI Health Assistant. I can analyze your vitals, answer health questions, and help you set reminders. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [showReminders, setShowReminders] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    const saved = localStorage.getItem("cardioReminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cardioReminders", JSON.stringify(reminders));
  }, [reminders]);

  const classifyVital = (name, value) => {
    const checks = {
      heartRate: value < 60 ? "low" : value > 100 ? "high" : "normal",
      spo2: value < 95 ? "low" : value === 100 ? "excellent" : "normal",
      stress: value < 30 ? "low" : value > 60 ? "high" : "moderate",
      ces: value < 40 ? "poor" : value < 60 ? "moderate" : value < 80 ? "good" : "optimized",
      cardiacAge: value < 30 ? "healthy" : value < 40 ? "fair" : "needs attention",
    };
    return checks[name] || "normal";
  };

  const generatePersonalizedRecommendation = (topic) => {
    const q = topic.toLowerCase();

    if (q.includes("health") || q.includes("analyze")) {
      const hrStatus = classifyVital("heartRate", vitals.heartRate);
      const spo2Status = classifyVital("spo2", vitals.spo2);
      const stressStatus = classifyVital("stress", vitals.stress);
      const cesStatus = classifyVital("ces", vitals.ces);

      let recs = `Here's your health snapshot:\n`;
      recs += `💓 Heart Rate: ${vitals.heartRate} bpm (${hrStatus})\n`;
      recs += `🫁 SpO₂: ${vitals.spo2}% (${spo2Status})\n`;
      recs += `😰 Stress: ${vitals.stress}/100 (${stressStatus})\n`;
      recs += `✨ CES: ${vitals.ces}/100 (${cesStatus})\n\n`;

      if (cesStatus === "optimized" && stressStatus === "low") {
        recs += "Excellent! Your cardiovascular profile looks strong. Maintain your current routine with 3-4 sessions of moderate exercise weekly and 7-8 hours of sleep.";
      } else if (stressStatus === "high") {
        recs += "Your stress is elevated. Try deep breathing (5-10 min), reduce intense activity, stay hydrated, and ensure adequate rest. Consider consulting a healthcare provider if it persists.";
      } else if (hrStatus === "high") {
        recs += "Your heart rate is elevated. Avoid intense activity today, focus on hydration and rest. Consult a doctor if this continues.";
      } else if (spo2Status === "low") {
        recs += "Your oxygen levels are lower than ideal. Ensure good ventilation, avoid strenuous activity, and contact a healthcare professional if it doesn't improve.";
      } else {
        recs += "Your vitals are stable. Continue monitoring and maintain your current healthy habits.";
      }
      return recs;
    }

    if (q.includes("heart rate") || q.includes("bpm") || q.includes("pulse")) {
      const status = classifyVital("heartRate", vitals.heartRate);
      const assessment =
        status === "low"
          ? "Your heart rate is lower than typical (60-100 bpm). If you're athletic, this is normal. Otherwise, consult a doctor."
          : status === "high"
          ? "Your heart rate is elevated above the typical 60-100 bpm range. This could indicate stress, activity, or a health condition. Rest and hydrate."
          : "Your heart rate is within the normal resting range of 60-100 bpm. Good sign!";

      return `Your current heart rate is ${vitals.heartRate} bpm (${status}).\n\n${assessment}`;
    }

    if (q.includes("spo2") || q.includes("oxygen")) {
      const status = classifyVital("spo2", vitals.spo2);
      return `Your SpO₂ is ${vitals.spo2}% (${status}).\n\nNormal oxygen saturation is 95-100%. If yours is below 90%, seek medical attention. Your current level is ${status === "low" ? "lower than ideal—rest and hydrate." : "healthy and normal."}`;
    }

    if (q.includes("stress") || q.includes("anxious") || q.includes("tense")) {
      const status = classifyVital("stress", vitals.stress);
      let advice =
        status === "high"
          ? "Try these: 5-10 min deep breathing, reduce intense activity, stay hydrated, prioritize 7-8 hrs sleep. If stress persists, consult a healthcare provider."
          : status === "low"
          ? "Your stress is well-managed. Keep up your current routine!"
          : "Your stress is moderate. Consider adding relaxation practices like yoga or meditation.";

      return `Your stress level is ${vitals.stress}/100 (${status}).\n\n${advice}`;
    }

    if (q.includes("recovery") || q.includes("rest")) {
      return `Your recovery status is: ${vitals.recovery}\n\n${
        vitals.recovery === "Poor"
          ? "You need more rest. Avoid intense activity for 24 hours, prioritize 7-8 hours of sleep, and hydrate well."
          : vitals.recovery === "Excellent"
          ? "Great recovery! You're ready for moderate to intense activity."
          : "Your recovery is moderate. Light to moderate activity is fine. Listen to your body."
      }`;
    }

    if (q.includes("ces") || q.includes("score") || q.includes("enhancement")) {
      const status = classifyVital("ces", vitals.ces);
      return `Your CES (Cardiac Enhancement Score) is ${vitals.ces}/100 (${status}).\n\nCES reflects your cardiovascular stability and recovery. Scores above 80 indicate optimized performance. To improve: exercise regularly, manage stress, and get adequate sleep.`;
    }

    if (q.includes("cardiac age") || q.includes("age")) {
      return `Your cardiac age is ${vitals.cardiacAge} years.\n\nCardiac age reflects your heart's biological health. Improve it by: regular exercise (150 min/week), healthy diet, stress management, and adequate sleep (7-8 hrs).`;
    }

    if (q.includes("exercise") || q.includes("workout") || q.includes("train")) {
      const cesStatus = classifyVital("ces", vitals.ces);
      return cesStatus === "optimized"
        ? `Your cardiovascular profile is excellent. Safe to do 30-60 min of moderate to intense exercise. Stay hydrated, warm up, and cool down.`
        : cesStatus === "poor"
        ? `Your CES is low. Stick to light to moderate activity (walking, gentle stretching). Avoid intense exercise today.`
        : `Your profile is fair. Light to moderate exercise (20-30 min) is recommended. Avoid high intensity today.`;
    }

    if (q.includes("sleep") || q.includes("rest")) {
      return `Sleep is crucial for cardiovascular health. Aim for 7-8 hours nightly. Good sleep: lowers stress, improves recovery, reduces heart disease risk, and stabilizes blood pressure.\n\nTips: Consistent bedtime, dark/cool room, no screens 30 min before bed, avoid caffeine 6 hrs before sleep.`;
    }

    if (q.includes("hydration") || q.includes("water")) {
      return `Hydration is essential for heart health. Aim for 8-10 glasses (2-3 liters) daily, more if exercising or in hot weather.\n\nBenefits: Helps blood circulation, regulates heart rate, improves oxygen delivery, and supports recovery.`;
    }

    if (q.includes("remind")) {
      return "I can set reminders for you! Say something like: 'Remind me to drink water at 2 PM' or 'Remind me to exercise every morning at 6 AM'.";
    }

    return `I'm not sure about that. I can help with: heart rate, SpO₂, stress, recovery, CES, cardiac age, exercise advice, sleep tips, hydration, or health education. What would you like to know?`;
  };

  const parseReminder = (text) => {
    const reminderRegex = /remind me to (.+?)(?:at|every|in|@)?\s*(.+?)$/i;
    const match = text.match(reminderRegex);

    if (!match) return null;

    const task = match[1].trim();
    const timeStr = match[2].trim();

    return { task, time: timeStr, id: Date.now(), created: new Date().toLocaleString() };
  };

  const addReminder = (text) => {
    const reminder = parseReminder(text);
    if (reminder) {
      setReminders((prev) => [...prev, reminder]);
      return `Reminder set: "${reminder.task}" at ${reminder.time}. I'll help keep you on track!`;
    }
    return null;
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const buildContextualReply = (text) => {
    const reminderReply = addReminder(text);
    if (reminderReply) return reminderReply;

    if (text.toLowerCase().includes("my reminders")) {
      setShowReminders(true);
      return reminders.length > 0
        ? `You have ${reminders.length} reminder(s). Check the list below!`
        : `No reminders set yet. Say "Remind me to..." to create one.`;
    }

    const lowerText = text.toLowerCase();
    for (const [term, definition] of Object.entries(HEALTH_TERMS)) {
      if (lowerText.includes(term)) {
        return `**${term.toUpperCase()}**\n\n${definition}`;
      }
    }

    return generatePersonalizedRecommendation(text);
  };

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    let reply;
    try {
      reply = buildContextualReply(trimmed);
    } catch (err) {
      reply = "I encountered an issue processing your message. Please try again.";
    }

    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar title="AI Health Assistant" />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex gap-6">
          {/* Chat Section */}
          <div className="flex-1 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col h-[75vh]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                <FaHeartbeat size={16} />
              </div>
              <div>
                <p className="font-semibold text-sm">CardioSense AI Health Assistant</p>
                <p className="text-[11px] text-slate-400">
                  Live insights when connected — local guidance offline
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 ${m.role === "assistant" ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      m.role === "assistant" ? "bg-cyan-400/10 text-cyan-400" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {m.role === "assistant" ? <FaHeartbeat size={14} /> : <FaUser size={13} />}
                  </div>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white/5 border border-white/10 whitespace-pre-wrap ${
                      m.role === "assistant" ? "rounded-tl-sm" : "rounded-tr-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-cyan-400/10 text-cyan-400">
                    <FaHeartbeat size={14} />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm bg-white/5 border border-white/10 text-slate-400 flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
                      ⚙️
                    </motion.span>
                    AI is thinking...
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length < 3 && (
              <div className="px-5 py-3 border-t border-white/10">
                <p className="text-xs text-slate-400 mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s.text}
                      onClick={() => send(s.text)}
                      className="text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                    >
                      {s.icon} {s.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 px-5 py-4 border-t border-white/10">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send(input)}
                placeholder="Ask about your health, set reminders..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30"
              />
              <button
                onClick={() => send(input)}
                className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-400/20 transition-colors"
              >
                <HiOutlinePaperAirplane size={16} />
              </button>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="w-80 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col h-[75vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FaClock className="text-amber-400" size={14} />
                <p className="font-semibold text-sm">Reminders</p>
              </div>
              <span className="text-xs bg-white/10 px-2 py-1 rounded-full">{reminders.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
              {reminders.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">
                  No reminders yet. Say "Remind me to..." to create one.
                </p>
              ) : (
                reminders.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1 group hover:bg-white/10 transition-colors"
                  >
                    <p className="text-white font-medium">{r.task}</p>
                    <p className="text-slate-400">🕐 {r.time}</p>
                    <button
                      onClick={() => deleteReminder(r.id)}
                      className="mt-2 w-full py-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
                    >
                      <FaTrash size={10} /> Delete
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            <div className="border-t border-white/10 px-4 py-3">
              <button
                onClick={() => setShowReminders(!showReminders)}
                className="w-full text-xs py-2 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 rounded-lg text-cyan-400 transition-colors"
              >
                {showReminders ? "Hide" : "Show"} All Reminders
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
