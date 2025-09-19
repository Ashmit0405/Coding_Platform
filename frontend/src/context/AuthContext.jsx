import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (jwt) => {
    try {
      const res = await fetch("http://localhost:5000/api/me", {
        headers: { Authorization: `Bearer ${jwt}` },
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();
      console.log(data)
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("accessToken", data.data.accessToken);
      setToken(data.data.accessToken);
      setUser(data.data.user);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    try {
        const res=await fetch("http://localhost:5000/api/logout",{
            method: "POST",
            credentials: "include"
        });
        const data=await res.json();
        if(!res.ok) throw new Error(data.message||"LogOut Failed");
        setToken(null);
        setUser(null);
        
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
