"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/loading.svg";
import "./Navbar.css";

export default function Navbar({ onAuthButtonClick }) {
  const handleClick = (e, type) => {
    e.preventDefault();
    onAuthButtonClick(type);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo-container">
          <Image
            src={logo}
            alt="Graid Logo"
            className="navbar-logo"
            width={45}
            height={45}
          />
          <Link href="/" className="logo-text">
            <span>gr</span>
            <span className="blue">ai</span>
            <span>d</span>
            <span className="blue">.</span>
          </Link>
        </div>

        {/* Center Navigation */}
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link href="/contact" className="nav-link">
            Contact Us
          </Link>
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
