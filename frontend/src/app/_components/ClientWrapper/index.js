"use client";

import React from "react";
import Navbar from "@/app/_components/HomeNavbar";
import AuthSidebar from "@/app/_components/AuthSidebar";
import { useSidebar } from "@/app/_hooks/useSidebar";

export default function ClientWrapper({ children }) {
  const {
    sidebarType,
    setSidebarType,
    isSidebarOpen,
    handleAuthClick,
    handleClose,
  } = useSidebar();

  return (
    <>
      <Navbar onAuthButtonClick={handleAuthClick} />
      {children}
      <AuthSidebar
        isOpen={isSidebarOpen}
        onClose={handleClose}
        authType={sidebarType}
        setAuthType={setSidebarType}
      />
    </>
  );
}
