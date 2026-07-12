import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api, { setAccessToken, setLogoutHandler } from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session on app load

  const logout = () => {
    setUser(null);
    setAccessToken(null);
  };

  useEffect(() => {
    setLogoutHandler(logout);

    // On app load / refresh, try to silently restore the session using the refreshToken cookie
    const tryRestoreSession = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5900/api/auth/refresh-token",
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data.data.accessToken;
        setAccessToken(newAccessToken);

        const meRes = await api.get("/auth/me");
        setUser(meRes.data.data.user);
      } catch {
        // no valid refresh token cookie — user just isn't logged in
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
