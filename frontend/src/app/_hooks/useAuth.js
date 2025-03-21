"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth as useAuthContext } from "@/app/_context/AuthContext";

export function useAuth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuthContext();

  const getRoleId = (role) => {
    if (role === "student") return 3;
    if (role === "teacher") return 2;
    return 1;
  };

  const handleAuth = async (authType) => {
    setIsLoading(true);
    setError("");

    try {
      if (email === "" || password === "") {
        throw new Error("Email and password are required");
      }

      // TODO: Remove this after testing
      if (email === "admin@admin.com") {
        const mockUser = {
          user_id: "123",
          name: "Admin",
          email: "admin@admin.com",
          access_token: "123",
        };
        await login(mockUser);
        router.push("/student");
        return true;
      }

      const endpoint =
        authType === "login"
          ? `${process.env.NEXT_PUBLIC_API_URL}auth/login`
          : `${process.env.NEXT_PUBLIC_API_URL}auth/register`;

      const roleId = getRoleId(role);
      const body =
        authType === "login"
          ? { email, password }
          : { email, password, username, role_id: roleId };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }
      // Store user data in context
      await login({
        user_id: data.user_id,
        roleId: data.role_id,
        access_token: data.access_token,
      });

      if (authType === "login") {
        router.push("/student");
      } 
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuth = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    username,
    setUsername,
    role,
    setRole,
    isLoading,
    error,
    handleAuth,
    resetAuth,
  };
}
