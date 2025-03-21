"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useAuth } from "@/app/_hooks/useAuth";
import "./AuthSidebar.css";

export default function AuthSidebar({
  isOpen,
  onClose,
  authType,
  setAuthType,
}) {
  const {
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
  } = useAuth();

  const sidebarRef = useRef(null);
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
  }, [isOpen, onClose, resetAuth]);

  const isLogin = authType === "login";
  const title = isLogin ? "Login" : "Sign Up";
  const buttonText = isLogin ? "Login" : "Sign Up";
  const toggleText = isLogin
    ? "Don't have an account? Sign Up"
    : "Already have an account? Login";

  const handleToggle = () => {
    setAuthType(authType === "login" ? "signup" : "login");
    resetAuth();
  };

  const handleSubmit = async () => {
    const success = await handleAuth(authType);
    if (success) {
      onClose();
    }
  };

  return (
    <motion.div
      ref={sidebarRef}
      className="sidebar"
      initial={{ x: "100%" }}
      animate={{ x: isOpen ? 0 : "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <div className="sidebar-content">
        <h2 className="login-title">{title}</h2>

        <div className="form-group">
          {error && <div className="error-message">{error}</div>}

          {authType === "signup" && (
            <>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                disabled={isLoading}
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field"
                disabled={isLoading}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}

          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            disabled={isLoading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            disabled={isLoading}
          />

          <button
            className="login-button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            <span>{isLoading ? "Loading..." : buttonText}</span>
            {!isLoading && (
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            )}
          </button>
        </div>

        <div className="signup-text">
          <a href="#" onClick={handleToggle} className="signup-link">
            {toggleText}
          </a>
        </div>

        <div className="divider">
          <span className="divider-text">or continue with</span>
        </div>

        {/* <div className="social-buttons">
          <button className="social-button">
            <Image src="/apple-logo.png" alt="Apple" width={24} height={24} />
          </button>
          <button className="social-button">
            <Image src="/google-logo.png" alt="Google" width={24} height={24} />
          </button>
          <button className="social-button">
            <Image
              src="/linkedin-logo.png"
              alt="LinkedIn"
              width={24}
              height={24}
            />
          </button>
          <button className="social-button">
            <Image
              src="/twitter-logo.png"
              alt="Twitter"
              width={24}
              height={24}
            />
          </button>
        </div> */}
      </div>
    </motion.div>
  );
}
