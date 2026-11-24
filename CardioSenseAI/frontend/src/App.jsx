import { Navigate, Route, Routes } from "react-router-dom";
import { VitalsProvider } from "./context/VitalsContext";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import AIAssistant from "./pages/AIAssistant";

function App() {
  return (
    <VitalsProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </VitalsProvider>
  );
}

export default App;