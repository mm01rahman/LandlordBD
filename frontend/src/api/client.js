// src/api/client.js
import axios from "axios";

// 1) Read env (support multiple names), trim trailing slashes
const configuredApiUrl = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  ""
).replace(/\/+$/, "");

if (!configuredApiUrl) {
  // Helps you immediately spot missing Netlify env var in console
  // (won't break build, but will make requests fail clearly)
  console.warn(
    "⚠️ Missing VITE_API_BASE_URL (or VITE_API_URL). Set it to: https://landlordbd-1.onrender.com"
  );
}

// 2) Ensure /api is present
const apiHost = configuredApiUrl.endsWith("/api")
  ? configuredApiUrl
  : `${configuredApiUrl}/api`;

// 3) Create axios client
const client = axios.create({
  baseURL: apiHost,          // ✅ always hits /api/...
  withCredentials: false,    // 🔒 NO cookies, token-only
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// 4) Attach Bearer token automatically
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 5) Optional: helpful error logging (keeps your UI clean)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend is down or CORS blocks, error.response may be undefined
    const status = error?.response?.status;
    const url = error?.config?.url;
    if (!status) {
      console.error("Network/CORS error:", { url, message: error?.message });
    }
    return Promise.reject(error);
  }
);

export default client;
