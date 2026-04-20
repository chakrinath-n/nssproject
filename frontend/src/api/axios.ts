import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ from .env
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url || "";

    // ✅ Send correct token based on route
    let token: string | null = null;

    if (url.startsWith("/officer")) {
      token = localStorage.getItem("officer_token");
    } else {
      token =
        localStorage.getItem("token") ||
        localStorage.getItem("officer_token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;