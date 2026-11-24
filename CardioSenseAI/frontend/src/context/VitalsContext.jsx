import { createContext, useContext, useEffect, useState } from "react";
import { getVitals } from "../services/api";

const VitalsContext = createContext(null);

const initialVitals = {
  heartRate: 0,
  spo2: 0,
  temperature: 0,
  cardiacAge: 0,
  ces: 0,
  ecg: 0,
  fingerDetected: false,

  recovery: "Moderate",
  stress: 0,

  connection: "offline",
  sensor: "MAX30102 / AD8232",
  lastUpdated: null,
};

/*
 * Temporary dashboard derivation.
 * We can replace this later with the final physiological algorithm.
 */
function calculateStressAndRecovery(ces) {
  if (ces >= 95) {
    return {
      stress: 5,
      recovery: "Excellent",
    };
  }

  if (ces >= 85) {
    return {
      stress: 15,
      recovery: "Good",
    };
  }

  if (ces >= 70) {
    return {
      stress: 30,
      recovery: "Moderate",
    };
  }

  if (ces >= 50) {
    return {
      stress: 50,
      recovery: "Poor",
    };
  }

  return {
    stress: 70,
    recovery: "Poor",
  };
}

export function VitalsProvider({ children }) {
  const [vitals, setVitals] = useState(initialVitals);

  useEffect(() => {
    let mounted = true;

    async function fetchVitals() {
      try {
        const data = await getVitals();

        if (!mounted) return;

        const ces = data.ces ?? 0;

        // Derive stress and recovery from current live CES.
        const derived = calculateStressAndRecovery(ces);

        setVitals((prev) => ({
          ...prev,

          heartRate: data.heartRate ?? 0,
          spo2: data.spo2 ?? 0,
          temperature: data.temperature ?? 0,
          cardiacAge: data.cardiacAge ?? 0,
          ces: ces,
          ecg: data.ecg ?? 0,
          fingerDetected: data.fingerDetected ?? false,

          stress: derived.stress,
          recovery: derived.recovery,

          connection: data.connection ?? "offline",
          sensor: data.sensor ?? "MAX30102 / AD8232",
          lastUpdated: data.lastUpdated ?? null,
        }));
      } catch (error) {
        console.error("Failed to fetch live vitals:", error);

        if (mounted) {
          setVitals((prev) => ({
            ...prev,
            connection: "offline",
          }));
        }
      }
    }

    // Fetch immediately.
    fetchVitals();

    // Refresh live data every second.
    const interval = setInterval(fetchVitals, 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <VitalsContext.Provider value={vitals}>
      {children}
    </VitalsContext.Provider>
  );
}

export function useVitals() {
  const ctx = useContext(VitalsContext);

  if (!ctx) {
    throw new Error("useVitals must be used within VitalsProvider");
  }

  return ctx;
}