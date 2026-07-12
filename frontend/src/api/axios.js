import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5900/api",
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
});

let accessToken = null;
let onLogout = null; // set by AuthContext so this file can trigger a logout when refresh fails

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
      originalRequest._retry = true; // prevent infinite retry loop
      try {
        const res = await axios.post(
          "http://localhost:5900/api/auth/refresh-token",
          {},
          { withCredentials: true }
        );
        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest); // retry the original failed request
      } catch (refreshError) {
        setAccessToken(null);
        if (onLogout) onLogout(); // refresh token itself expired — force logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;