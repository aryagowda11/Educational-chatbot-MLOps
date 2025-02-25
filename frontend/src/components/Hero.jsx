"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./Hero.css";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading state
  }

  return (
    <AnimatePresence>
      <div className="hero">
        {/* Background Pattern */}
        <div className="background-pattern">
          <div className="pattern-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="circle-container"
            >
              <div className="circle animate-spin-slow"></div>
              <div className="inner-circle animate-spin-slower"></div>
            </motion.div>
          </div>
        </div>

        {/* Hero Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hero-text"
        >
          FUTURE OF LEARNING IS HERE
          <span className="blue-dot">.</span>
        </motion.h1>
      </div>
    </AnimatePresence>
  );
}
