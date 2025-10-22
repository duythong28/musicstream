import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from Clerk (will be added in components)
    const token = window.__clerk_token;
    const sessionId = window.__clerk_session_id;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (sessionId) {
      config.headers["x-clerk-session-id"] = sessionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

export default api;
