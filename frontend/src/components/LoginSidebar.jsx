"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import "../styles/LoginSidebar.css";

export default function LoginSidebar({
  isOpen,
  onClose,
  authType,
  setAuthType,
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const isLogin = authType === "login";
  const title = isLogin ? "Login" : "Sign Up";
  const buttonText = isLogin ? "Login" : "Sign Up";
  const toggleText = isLogin
    ? "Don't have an account? Sign Up"
    : "Already have an account? Login";

  const handleToggle = () => {
    setAuthType(authType === "login" ? "signup" : "login");
    // onClose();
    // You can add navigation or state change here
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
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />

          <button
            className="login-button"
            onClick={() => {
              // Handle login/signup logic here
              onClose();
            }}
          >
            <span>{buttonText}</span>
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
