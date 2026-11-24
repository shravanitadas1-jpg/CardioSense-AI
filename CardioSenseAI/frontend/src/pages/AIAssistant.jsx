import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaBell, FaHeartbeat, FaTrash, FaUser } from "react-icons/fa";
import { HiOutlinePaperAirplane } from "react-icons/hi";
import Navbar from "../components/Navbar";
import { useVitals } from "../context/VitalsContext";
import { getAnalytics } from "../services/api";

const suggestionChips = [
  "Analyze my health",
  "Explain CES",
  "Is my heart rate normal?",
  "Recovery tips",
  "Stress reduction",
];

export default function AIAssistant() {
  const vitals = useVitals();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello, I'm your CardioSense AI Health Assistant. I can explain your vitals, offer wellness guidance, and help you set reminders. Ask me about heart rate, SpO₂, ECG, CES, stress, recovery, or cardiac age.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [notificationsReady, setNotificationsReady] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = window.localStorage.getItem("cardiosense-reminders");
      if (saved) {
        setReminders(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Unable to load reminders", err);
    }

    if ("Notification" in window) {
      setNotificationsReady(Notification.permission === "granted");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cardiosense-reminders", JSON.stringify(reminders));
    }
  }, [reminders]);

  const requestNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationsReady(permission === "granted");
  };

  const showReminderNotification = (text) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("CardioSense reminder", { body: text });
    }
  };

  const deleteReminder = (id) => {
    setReminders((prev) => prev.filter((item) => item.id !== id));
  };

  const getContextTopic = (history) => {
    const relevant = history
      .slice()
      .reverse()
      .find((entry) => entry.role === "assistant" || entry.role === "user");

    if (!relevant?.text) return null;
    const text = relevant.text.toLowerCase();
    if (/(heart rate|pulse|bpm)/.test(text)) return "heart rate";
    if (/(spo2|spo₂|oxygen|oxygen saturation)/.test(text)) return "spO₂";
    if (/(ces|cardiac enhancement score)/.test(text)) return "CES";
    if (/(stress|anxious|tense|calm)/.test(text)) return "stress";
    if (/(recover|recovery|rest|sleep)/.test(text)) return "recovery";
    if (/(cardiac age|age)/.test(text)) return "cardiac age";
    if (/(ecg|electrocardiogram)/.test(text)) return "ECG";
    if (/(hrv|heart rate variability)/.test(text)) return "HRV";
    return null;
  };

  const getPersonalizedRecommendation = (analytics) => {
    const stress = analytics?.stress ?? vitals.stress;
    const recovery = analytics?.classification || vitals.recovery;
    const suggestions = [];

    if (stress > 60) {
      suggestions.push("Take 5 minutes to breathe slowly and keep your environment calm.");
    } else if (stress > 35) {
      suggestions.push("Keep your hydration steady and avoid pushing yourself too hard today.");
    }

    if (vitals.spo2 < 95) {
      suggestions.push("Pause and monitor your oxygen saturation closely if symptoms continue.");
    } else {
      suggestions.push("Stay hydrated and keep your routine steady.");
    }

    if (recovery === "Poor" || recovery === "Fair") {
      suggestions.push("Prioritize sleep and keep exercise light for the next day or two.");
    } else {
      suggestions.push("A gentle walk or light activity can help you stay balanced.");
    }

    if (vitals.heartRate > 100) {
      suggestions.push("Rest and avoid intense effort until you feel settled.");
    }

    return suggestions.join(" ");
  };

  const detectMetric = (text) => {
    const q = text.toLowerCase();
    if (/(heart rate|pulse|bpm|beats per minute)/.test(q)) return "heart rate";
    if (/(spo2|spo₂|oxygen|oxygen saturation)/.test(q)) return "spO₂";
    if (/(ces|cardiac enhancement score)/.test(q)) return "CES";
    if (/(stress|anxious|tense|calm)/.test(q)) return "stress";
    if (/(recover|recovery|rest|sleep)/.test(q)) return "recovery";
    if (/(cardiac age|age)/.test(q)) return "cardiac age";
    if (/(ecg|electrocardiogram)/.test(q)) return "ECG";
    if (/(ai status|assistant status|status)/.test(q)) return "AI status";
    if (/(hrv|heart rate variability)/.test(q)) return "HRV";
    return null;
  };

  const classifyMetric = (value, type) => {
    switch (type) {
      case "heart rate":
        if (value < 60) return { level: "abnormal", label: "below the usual resting range" };
        if (value <= 100) return { level: "normal", label: "within a typical resting range" };
        return { level: "abnormal", label: "above the usual resting range" };
      case "spO₂":
        if (value >= 96) return { level: "normal", label: "in a reassuring range" };
        if (value >= 93) return { level: "borderline", label: "borderline but still worth watching" };
        return { level: "abnormal", label: "lower than the usual range" };
      case "CES":
        if (value >= 80) return { level: "normal", label: "strong" };
        if (value >= 65) return { level: "borderline", label: "moderate" };
        return { level: "abnormal", label: "lower than expected" };
      case "stress":
        if (value < 35) return { level: "normal", label: "manageable" };
        if (value < 60) return { level: "borderline", label: "elevated" };
        return { level: "abnormal", label: "high" };
      case "recovery":
        if (value === "Good" || value === "Excellent") return { level: "normal", label: "strong" };
        if (value === "Fair") return { level: "borderline", label: "mixed" };
        return { level: "abnormal", label: "strained" };
      default:
        return { level: "normal", label: "stable" };
    }
  };

  const buildHealthSummary = (analytics) => {
    const ces = analytics?.ces ?? vitals.ces;
    const stress = analytics?.stress ?? vitals.stress;
    const recovery = analytics?.classification || vitals.recovery;
    const hrStatus = classifyMetric(vitals.heartRate, "heart rate");
    const spo2Status = classifyMetric(vitals.spo2, "spO₂");
    const cesStatus = classifyMetric(ces, "CES");
    const stressStatus = classifyMetric(stress, "stress");
    const recoveryStatus = classifyMetric(recovery, "recovery");

    const advice = [];
    if (stressStatus.level === "abnormal") advice.push("consider a few minutes of slow breathing and lighter activity");
    else if (stressStatus.level === "borderline") advice.push("keep hydration and recovery habits steady");
    if (spo2Status.level === "abnormal") advice.push("monitor oxygen saturation closely and seek professional care if symptoms continue");
    if (recoveryStatus.level === "abnormal") advice.push("prioritize sleep and avoid overexertion today");
    if (advice.length === 0) advice.push("maintain your current routine and stay hydrated");

    const overall = hrStatus.level === "normal" && spo2Status.level === "normal" && cesStatus.level === "normal" && stressStatus.level !== "abnormal" ? "generally steady" : "mixed";
    return `Your current snapshot looks ${overall}. Heart rate is ${vitals.heartRate} bpm, SpO₂ is ${vitals.spo2}%, CES is ${ces}/100, stress is ${stress}, and recovery is "${recovery}". ${advice.join("; ")}. I can help explain these numbers in plain language, but I’m not a diagnosis tool.`;
  };

  const explainTerm = (text) => {
    const q = text.toLowerCase();
    if (/(ecg|electrocardiogram)/.test(q)) {
      return "An ECG is a recording of the heart’s electrical activity. It helps clinicians look for rhythm changes and other patterns, but it does not diagnose everything by itself.";
    }
    if (/(spo2|spo₂|oxygen saturation)/.test(q)) {
      return "SpO₂ measures how much oxygen your blood is carrying. Values above 95% are usually reassuring, while lower readings can be worth discussing with a clinician if symptoms are present.";
    }
    if (/(ces|cardiac enhancement score)/.test(q)) {
      return "CES stands for Cardiac Enhancement Score. It is a practical summary of how your cardiovascular profile is trending, combining recovery, stability, and overall readiness.";
    }
    if (/(hrv|heart rate variability)/.test(q)) {
      return "HRV, or heart rate variability, reflects the variation between heartbeats. It is often used as a signal of recovery and stress balance, though it is only one piece of the picture.";
    }
    if (/(stress)/.test(q)) {
      return "Stress refers to how much strain your body is under. Mild stress is common, but persistent high stress can affect recovery, sleep, and overall comfort.";
    }
    if (/(recover|recovery)/.test(q)) {
      return "Recovery is how well your body is bouncing back after activity or daily strain. Good recovery often supports better energy, sleep, and training readiness.";
    }
    if (/(cardiac age)/.test(q)) {
      return "Cardiac age is an estimate of how your cardiovascular profile compares with typical age-based expectations. It is a general guide, not a medical diagnosis.";
    }
    return "I can explain terms like ECG, SpO₂, CES, HRV, stress, recovery, and cardiac age. Ask me about one of them directly and I’ll break it down simply.";
  };

  const describeMetric = (metric, analytics) => {
    const ces = analytics?.ces ?? vitals.ces;
    const stress = analytics?.stress ?? vitals.stress;
    const recovery = analytics?.classification || vitals.recovery;

    if (metric === "heart rate") {
      const status = classifyMetric(vitals.heartRate, "heart rate");
      const guidance = vitals.heartRate > 100
        ? "Try resting, breathing slowly, and avoid hard exertion until you feel settled."
        : vitals.heartRate < 60
          ? "If you feel dizzy or unusually fatigued, consider speaking with a healthcare professional."
          : "Stay hydrated and keep an eye on how you feel after activity.";
      return `Your heart rate is ${vitals.heartRate} bpm. That looks ${status.level === "normal" ? "within a usual resting range" : status.label}. ${guidance}`;
    }

    if (metric === "spO₂") {
      const status = classifyMetric(vitals.spo2, "spO₂");
      const guidance = vitals.spo2 < 93
        ? "If you are breathless or uncomfortable, seek prompt medical advice."
        : "Keep monitoring it and stay relaxed if you are resting.";
      return `Your SpO₂ is ${vitals.spo2}%. That is ${status.label}. ${guidance}`;
    }

    if (metric === "CES") {
      const status = classifyMetric(ces, "CES");
      return `Your CES is ${ces}/100. That is ${status.label} for most people. Higher scores usually reflect more favorable recovery and cardiovascular steadiness, while lower scores may suggest a need for more rest, hydration, and sleep.`;
    }

    if (metric === "stress") {
      const status = classifyMetric(stress, "stress");
      return `Your stress reading is ${stress}. That is ${status.label}. A short breathing cycle, a gentle walk, or a quiet break can help when stress is elevated.`;
    }

    if (metric === "recovery") {
      const status = classifyMetric(recovery, "recovery");
      return `Your recovery status is "${recovery}". That looks ${status.label}. If it is low, prioritize sleep, hydration, and lighter activity today.`;
    }

    if (metric === "cardiac age") {
      return `Your estimated cardiac age is ${vitals.cardiacAge} years. That is an estimate rather than a diagnosis, but it can be a useful way to compare your cardiovascular profile with typical expectations.`;
    }

    if (metric === "ECG") {
      return "An ECG records the heart’s electrical activity. It is often used to look for arrhythmias or other rhythm-related changes, and your AI assistant can explain the basics of what it shows.";
    }

    if (metric === "AI status") {
      return "I’m running with your current local vitals and can also use backend analytics when available. I can explain metrics, suggest general wellness steps, and help you manage reminders without claiming a diagnosis.";
    }

    if (metric === "HRV") {
      return "HRV is the variation between beats. It can be a useful signal of recovery and stress balance, but it should be interpreted with your overall symptoms and habits in mind.";
    }

    return buildHealthSummary(analytics);
  };

  const parseReminderRequest = (text) => {
    const lower = text.toLowerCase();
    if (!/(remind me to)/.test(lower)) {
      return null;
    }

    const taskMatch = lower.match(/remind me to\s+(.+?)(?:\s+at\s+|\s+every\s+|$)/i);
    const task = taskMatch ? taskMatch[1].trim() : lower.replace(/remind me to/i, "").trim();
    const timeMatch = lower.match(/at\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm))/i);
    const everyMatch = lower.match(/every\s+(\d+)\s*(hour|hours|hr|hrs|minute|minutes|min|mins)/i);

    const reminder = {
      id: Date.now().toString(),
      text: task.replace(/^take\s+/, ""),
      time: timeMatch ? timeMatch[1].toUpperCase() : null,
      frequency: everyMatch ? `${everyMatch[1]} ${everyMatch[2]}` : null,
      createdAt: new Date().toLocaleString(),
    };

    return reminder;
  };

  const buildAssistantReply = (text, history, analytics) => {
    const q = text.toLowerCase();
    const recentText = history.map((message) => message.text).join(" ").toLowerCase();
    const requestedMetric = detectMetric(q);
    const followUpMetric = /(what about|and|also|that|this)/.test(q) ? getContextTopic(history) : null;
    const metric = requestedMetric || followUpMetric;

    const reminder = parseReminderRequest(q);
    if (reminder) {
      const reminderText = reminder.time
        ? `Reminder saved for ${reminder.text} at ${reminder.time}.`
        : `Reminder saved for ${reminder.text} ${reminder.frequency ? `every ${reminder.frequency}` : "soon"}.`;
      setReminders((prev) => [...prev, reminder]);
      if (notificationsReady) {
        showReminderNotification(reminderText);
      }
      return reminderText;
    }

    if (/(analyz|analyze|health|overall|how am i|how am i doing|how's my|snapshot)/.test(q)) {
      return buildHealthSummary(analytics);
    }

    if (/(what is|explain|define|meaning of|what does)/.test(q)) {
      return explainTerm(q);
    }

    if (/(what should i do|what should i take|tips|advice|recommend|recommendation|help me)/.test(q)) {
      return `Based on your current readings, ${getPersonalizedRecommendation(analytics)} If anything feels unusual, reach out to a healthcare professional for guidance.`;
    }

    if (/(is my|normal|borderline|abnormal|too high|too low)/.test(q) && metric) {
      return describeMetric(metric, analytics);
    }

    if (metric === "heart rate" || /(heart rate|pulse|bpm)/.test(q)) {
      return describeMetric("heart rate", analytics);
    }
    if (metric === "spO₂" || /(spo2|spo₂|oxygen)/.test(q)) {
      return describeMetric("spO₂", analytics);
    }
    if (metric === "CES" || /(ces|cardiac enhancement score)/.test(q)) {
      return describeMetric("CES", analytics);
    }
    if (metric === "stress" || /(stress|anxious|tense|calm)/.test(q)) {
      return describeMetric("stress", analytics);
    }
    if (metric === "recovery" || /(recover|recovery|rest|sleep)/.test(q)) {
      return describeMetric("recovery", analytics);
    }
    if (metric === "cardiac age" || /(cardiac age|age)/.test(q)) {
      return describeMetric("cardiac age", analytics);
    }
    if (metric === "ECG" || /(ecg|electrocardiogram)/.test(q)) {
      return describeMetric("ECG", analytics);
    }
    if (metric === "AI status" || /(ai status|assistant status|status)/.test(q)) {
      return describeMetric("AI status", analytics);
    }
    if (metric === "HRV" || /(hrv|heart rate variability)/.test(q)) {
      return describeMetric("HRV", analytics);
    }
    if (/(exercise|workout|train|active)/.test(q)) {
      return "A balanced plan usually combines light movement, hydration, and enough sleep. If your stress or recovery is low, keep the session gentle and avoid pushing hard today.";
    }
    if (/(tip|tips|recommend|advice)/.test(q)) {
      return `A simple routine often helps: drink water, get a short walk, try slow breathing for five minutes, and aim for consistent sleep. ${getPersonalizedRecommendation(analytics)}`;
    }

    return `I can help you understand your current readings and offer supportive wellness guidance. Right now your heart rate is ${vitals.heartRate} bpm, SpO₂ is ${vitals.spo2}%, CES is ${vitals.ces}/100, stress is ${vitals.stress}, and recovery is "${vitals.recovery}". Ask me about one of those metrics or try a suggestion chip.`;
  };

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const context = [...messages.slice(-9), { role: "user", text: trimmed }];
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    try {
      const analytics = await getAnalytics();
      const reply = buildAssistantReply(trimmed, context, analytics);
      setTimeout(() => {
        setMessages((m) => [...m, { role: "assistant", text: reply }]);
        setTyping(false);
      }, 750);
    } catch (err) {
      const reply = buildAssistantReply(trimmed, context, null);
      setTimeout(() => {
        setMessages((m) => [...m, { role: "assistant", text: reply }]);
        setTyping(false);
      }, 750);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar title="AI Health Assistant" />

      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto h-[75vh] rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl flex flex-col">
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
                  className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed bg-white/5 border border-white/10 ${
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
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm bg-white/5 border border-white/10 text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">AI is thinking</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:120ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => send(chip)}
                  className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {chip}
                </button>
              ))}
            </div>

            {reminders.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <FaBell size={12} className="text-cyan-400" />
                    Reminders
                  </div>
                  <button
                    type="button"
                    onClick={() => requestNotifications()}
                    className="text-[11px] text-cyan-300"
                  >
                    {notificationsReady ? "Notifications on" : "Enable alerts"}
                  </button>
                </div>
                <ul className="mt-3 space-y-2">
                  {reminders.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2 rounded-xl bg-black/20 px-3 py-2 text-sm text-slate-200">
                      <div>
                        <p>{item.text}</p>
                        <p className="text-[11px] text-slate-400">
                          {item.time ? `At ${item.time}` : item.frequency ? `Every ${item.frequency}` : "Scheduled"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteReminder(item.id)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                        aria-label="Delete reminder"
                      >
                        <FaTrash size={12} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="p-4 border-t border-white/10 flex items-center gap-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your health, set a reminder, or explore a metric..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
            />
            <button
              type="submit"
              className="w-11 h-11 shrink-0 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center hover:bg-cyan-400/20 transition-colors"
              aria-label="Send"
            >
              <HiOutlinePaperAirplane size={18} className="rotate-90" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
