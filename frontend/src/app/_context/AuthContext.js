"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (response.ok) {
        setUserId(data.user.id);
      } else {
        setUserId(null);
      }
    } catch (error) {
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    setUserId(userData.user_id);
    sessionStorage.setItem("user_id", userData.user_id);
    sessionStorage.setItem("access_token", userData.access_token);
    sessionStorage.setItem("role_id", userData.roleId);
  };

  const logout = async () => {
    try {
      await fetch("/auth/logout", { method: "POST" });
      setUserId(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
