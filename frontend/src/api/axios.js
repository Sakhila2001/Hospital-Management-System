import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5900/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

let accessToken = null;
let onLogout = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const setLogoutHandler = (fn) => {
  onLogout = fn;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        if (onLogout) onLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;