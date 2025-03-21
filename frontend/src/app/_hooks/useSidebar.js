"use client";

import { useState } from "react";

export function useSidebar() {
  const [sidebarType, setSidebarType] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAuthClick = (type) => {
    setSidebarType(type);
    setIsSidebarOpen(true);
  };

  const handleClose = () => {
    setIsSidebarOpen(false);
  };

  return {
    sidebarType,
    setSidebarType,
    isSidebarOpen,
    handleAuthClick,
    handleClose,
  };
}
