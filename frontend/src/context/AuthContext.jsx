import { createContext, useEffect, useState, useCallback } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
const API = import.meta.env.VITE_BACKEND_URL;  
const refreshUser = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/refresh-access`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("No active session");
      const data = await res.json();
      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
    } catch (err) {
      console.log("No active session:", err);
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.data.message || "Login failed");

      setAccessToken(data.data.accessToken);
      setUser(data.data.user);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setAccessToken(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
