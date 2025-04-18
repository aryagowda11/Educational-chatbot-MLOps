"use client";

import { useEffect } from "react";
import { useAuth } from "@/app/_context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({ children }) {
  const { checkTokenExpiration } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const userId = sessionStorage.getItem("user_id");
    if (!userId || !checkTokenExpiration()) {
      // Use replace instead of push to prevent adding to browser history
      router.replace("/");
      return;
    }

    // Set up interval to check token expiration every minute
    const interval = setInterval(() => {
      if (!checkTokenExpiration()) {
        router.replace("/");
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [checkTokenExpiration, router]);

  return children;
}
