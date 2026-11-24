import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add error interceptor for better debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNREFUSED" || !error.response) {
      console.error("Backend server not running on http://127.0.0.1:8000");
    } else if (error.response) {
      console.error("API Error:", error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

export async function getVitals() {
  const response = await api.get("/live");
  return response.data;
}

export async function getHistory() {
  const response = await api.get("/history");
  return response.data;
}
export async function saveReading(reading) {
  const response = await api.post("/save-reading", reading);
  return response.data;
}

export async function getAnalytics() {
  const response = await api.get("/analytics");
  return response.data;
}

export default api;