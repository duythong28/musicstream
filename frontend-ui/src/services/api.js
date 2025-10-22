import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let getClerkToken = async () => null;

export const setGetToken = (fn) => {
  getClerkToken = fn;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from Clerk (will be added in components)\
    const token = await getClerkToken();
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
