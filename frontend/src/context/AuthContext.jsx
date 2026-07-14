import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import api, { setAccessToken, setLogoutHandler, API_BASE } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    setLogoutHandler(logout);

    const tryRestoreSession = async () => {
      try {
        const res = await axios.post(
          `${API_BASE}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);

        const meRes = await api.get("/auth/me");
        setUser(meRes.data.data.user);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    tryRestoreSession();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    setAccessToken(accessToken);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
