"use client";
<<<<<<< HEAD

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

=======
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth as useAuthContext } from "@/app/_context/AuthContext";

export function useAuth(isOpen, onClose, authType, setAuthType) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [role, setRole] = useState("student");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuthContext();

  const sidebarRef = useRef(null);

  const resetAuth = () => {
    setEmail("");
    setPassword("");
    setFirstname("");
    setLastname("");
    setRole("student");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
        resetAuth();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

>>>>>>> 911c895 (Initial Mask commit)
  const getRoleId = (role) => {
    if (role === "student") return 3;
    if (role === "teacher") return 2;
    return 1;
  };
<<<<<<< HEAD

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
=======
  const routeByRole = (roleId) => {
    if (roleId === 3) return "/student";
    if (roleId === 2) return "/instructor";
    return "/";
  };

  const handleAuth = async (authType) => {
    setIsLoading(true);

    try {
      if (email === "" || password === "") {
        toast.error("Email and password are required");
        return;
      }

      if (authType === "signup" && (firstname === "" || lastname === "")) {
        toast.error("First name and last name are required");
        return;
>>>>>>> 911c895 (Initial Mask commit)
      }

      const endpoint =
        authType === "login"
          ? `${process.env.NEXT_PUBLIC_API_URL}auth/login`
          : `${process.env.NEXT_PUBLIC_API_URL}auth/register`;

      const roleId = getRoleId(role);
<<<<<<< HEAD
      const body =
        authType === "login"
          ? { email, password }
          : { email, password, username, role_id: roleId };
=======
      const username =
        firstname && lastname
          ? `${firstname.toLowerCase()}_${lastname.toLowerCase()}`
          : "";

      const body =
        authType === "login"
          ? { email, password }
          : {
              email,
              password,
              username,
              firstname: firstname,
              lastname: lastname,
              role_id: roleId,
            };
>>>>>>> 911c895 (Initial Mask commit)

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include", // Important for cookies
      });

      const data = await response.json();

<<<<<<< HEAD
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
=======
      if (response.status === 422) {
        const errorMsg = data?.detail[0]?.msg || "Validation error";
        toast.error(errorMsg);
        return;
      }

      if (!response.ok) {
        const errorMsg = data.detail || "Authentication failed";
        toast.error(errorMsg);
        return;
      }

      if (authType === "login") {
        // Store user data in context
        await login({
          user_id: data.user_id,
          username: data.username,
          firstname: data.firstname,
          lastname: data.lastname,
          roleId: data.role_id,
          access_token: data.access_token,
        });

        router.push(routeByRole(data.role_id));
      } else {
        setSuccess("Account created successfully! You can now login.");
        toast.success("Account created successfully");
      }
      return true;
    } catch (err) {
      const errorMsg = err.message || "Something went wrong";
      toast.error(errorMsg);
>>>>>>> 911c895 (Initial Mask commit)
      return false;
    } finally {
      setIsLoading(false);
    }
  };

<<<<<<< HEAD
  const resetAuth = () => {
    setEmail("");
    setPassword("");
    setError("");
  };

  return {
=======
  const handleSubmit = async () => {
    const success = await handleAuth(authType);
    if (success) {
      onClose();
    }
  };

  const handleToggle = () => {
    setAuthType(authType === "login" ? "signup" : "login");
    resetAuth();
  };

  return {
    sidebarRef,
>>>>>>> 911c895 (Initial Mask commit)
    email,
    setEmail,
    password,
    setPassword,
<<<<<<< HEAD
    username,
    setUsername,
    role,
    setRole,
    isLoading,
    error,
    handleAuth,
    resetAuth,
=======
    firstname,
    setFirstname,
    lastname,
    setLastname,
    role,
    setRole,
    isLoading,

    handleSubmit,
    handleToggle,
>>>>>>> 911c895 (Initial Mask commit)
  };
}
