import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

// Interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('launchmate_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global Response Interceptor for Robustness
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 503) {
        toast.error("System under maintenance. Our co-founder AI is currently recalibrating.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
      } else if (status === 401) {
        // Handle Session Expiry
        const keysToRemove = ["token", "launchmate_token", "launchmate_is_logged_in"];
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // Redirect if not already on login/home
        const currentPath = window.location.pathname;
        if (!currentPath.includes('login') && !currentPath.includes('home')) {
            toast.warn("Session expired. Please re-authenticate.", { theme: "dark" });
            // For simple state-based routing apps, we might need a window.location reset
            // but let's just clear and warn for now.
        }
      } else if (status >= 500) {
        toast.error("Core Engine Error. Critical systems are stable, but request failed.", { theme: "dark" });
      }
    } else {
        toast.error("Network disruption detected. Re-establishing link...", { theme: "dark" });
    }
    return Promise.reject(error);
  }
);

export default api;
