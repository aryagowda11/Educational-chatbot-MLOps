"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import LoginSidebar from "@/components/LoginSidebar";

export default function ClientWrapper({ children }) {
  const [sidebarType, setSidebarType] = useState(null); // 'login' or 'signup'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAuthClick = (type) => {
    setSidebarType(type);
    setIsSidebarOpen(true);
  };

  return (
    <>
      <Navbar onAuthButtonClick={handleAuthClick} />
      {children}
      <LoginSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        authType={sidebarType}
        setAuthType={setSidebarType}
      />
    </>
  );
}
