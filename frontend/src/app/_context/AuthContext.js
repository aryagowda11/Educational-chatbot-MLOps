"use client";

import { createContext, useContext, useState, useEffect } from "react";
<<<<<<< HEAD
=======
import { useRouter } from "next/navigation";
>>>>>>> 911c895 (Initial Mask commit)

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

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
=======
  const router = useRouter();

  useEffect(() => {
    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      if (userId) {
        checkTokenExpiration();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [userId]);
>>>>>>> 911c895 (Initial Mask commit)

  const login = async (userData) => {
    setUserId(userData.user_id);
    sessionStorage.setItem("user_id", userData.user_id);
    sessionStorage.setItem("access_token", userData.access_token);
    sessionStorage.setItem("role_id", userData.roleId);
<<<<<<< HEAD
=======
    // sessionStorage.setItem("username", userData.username);
    sessionStorage.setItem("firstname", userData.firstname);
    sessionStorage.setItem("lastname", userData.lastname);
    const ttl = Date.now() + 30 * 60 * 1000; // Current time + 30 minutes in milliseconds
    sessionStorage.setItem("token_expiry", ttl.toString());
  };

  const checkTokenExpiration = () => {
    const tokenExpiry = sessionStorage.getItem("token_expiry");
    if (!tokenExpiry) {
      logout();
      return false;
    }

    const expirationTime = parseInt(tokenExpiry);
    const currentTime = Date.now();

    if (currentTime >= expirationTime) {
      if (typeof window !== "undefined") {
        window.alert("Your session has expired. Please login again.");
      }
      logout();
      return false;
    }
    return true;
>>>>>>> 911c895 (Initial Mask commit)
  };

  const logout = async () => {
    try {
<<<<<<< HEAD
      await fetch("/auth/logout", { method: "POST" });
      setUserId(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout, loading }}>
=======
      setUserId(null);
      // Clear all session storage items
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("role_id");
      sessionStorage.removeItem("token_expiry");
      sessionStorage.removeItem("username");

      // Use replace instead of push to prevent adding to browser history
      router.replace("/");

      // Clear browser history
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", "/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear storage even if logout API fails
      setUserId(null);
      sessionStorage.clear();
      router.replace("/");
    }
  };

  // Utility function to wrap API calls with token check
  const withTokenCheck = async (apiCall) => {
    if (!checkTokenExpiration()) {
      throw new Error("Session expired");
    }
    return apiCall();
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        login,
        logout,
        loading,
        checkTokenExpiration,
        withTokenCheck,
      }}
    >
>>>>>>> 911c895 (Initial Mask commit)
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
