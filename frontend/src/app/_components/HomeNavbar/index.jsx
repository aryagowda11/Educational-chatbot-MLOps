"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/loading.svg";
import { useEffect, useState } from "react";
import "./index.css";

export default function Navbar({ onAuthButtonClick }) {
  const [activeSection, setActiveSection] = useState("hero-section");

  useEffect(() => {
    const observerOptions = {
      root: null, // Observe relative to the viewport
      threshold: 0.6, // Trigger when 60% of a section is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Update active section
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Wait for DOM content to be fully loaded
    const observeSections = () => {
      const sections = ["hero-section", "about-section", "contact-section"];
      sections.forEach((id) => {
        const sectionElement = document.getElementById(id);
        if (sectionElement) {
          observer.observe(sectionElement); // Start observing
        }
      });
    };

    // Use a timeout or wait for the next render cycle to ensure DOM is ready
    setTimeout(observeSections, 0);

    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, []);

  const handleClick = (e, type) => {
    e.preventDefault();
    onAuthButtonClick(type);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className = "nav-left-container">
          <div className="logo-container">
            <Link href="/" className="logo-text">
              <span>gr</span>
              <span className="blue">ai</span>
              <span>d</span>
              <span className="blue">.</span>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="nav-links">
            <Link
              href="#hero-section"
              className={`nav-link ${
                activeSection === "hero-section" ? "active" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="#about-section"
              className={`nav-link ${
                activeSection === "about-section" ? "active" : ""
              }`}
            >
              About
            </Link>
            <Link
              href="#contact-section"
              className={`nav-link ${
                activeSection === "contact-section" ? "active" : ""
              }`}
            >
              Contact Us
            </Link>
          </div>
        </div>
        {/* Right Side Auth Links */}
        <div className="auth-links">
          <Link
            href="/signup"
            className="nav-link"
            onClick={(e) => handleClick(e, "signup")}
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="nav-link"
            onClick={(e) => handleClick(e, "login")}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
