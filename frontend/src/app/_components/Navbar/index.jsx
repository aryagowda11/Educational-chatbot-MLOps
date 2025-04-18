"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/loading.svg";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
<<<<<<< HEAD
import { CiHome, CiUser } from "react-icons/ci";
import { FaArrowLeft } from "react-icons/fa";

import "./index.css";

const handleOnSearch = (string, results) => {
  console.log(string, results);
};

const handleOnSelect = (item) => {
  console.log(item);
};

const formatResult = (item) => {
  return (
    <span style={{ display: "block", textAlign: "left" }}>{item.name}</span>
  );
};

function NavIcons() {
  return (
    <div className="headerIcons">
      <FaArrowLeft size={24} />
      <CiHome size={28} />
      <CiUser size={28} />
    </div>
  );
}
export default function Navbar({ onAuthButtonClick }) {
=======
// import { CiHome, CiUser } from "react-icons/ci";
// import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "@/app/_context/AuthContext";
import "./index.css";
import { useState, useCallback } from "react";
import { House, UserRound, ArrowLeft } from "lucide-react";
import SearchBar from "../SearchBar";

function NavIcons() {
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const router = useRouter();
  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    const newTimeoutId = setTimeout(() => {
      setShowDropdown(false);
    }, 1000); // 2 seconds delay
    setTimeoutId(newTimeoutId);
  };

  return (
    <div className="headerIcons">
      <ArrowLeft
        size={24}
        color="#979797"
        onClick={() => router.push("/student")}
        style={{ cursor: "pointer" }}
      />
      {/* <House 
        size={28} 
        color="#979797" 
        onClick={() => router.push("/student")}
        style={{ cursor: "pointer" }}
      /> */}
      <div
        className="user-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <UserRound color="#979797" size={24} style={{ cursor: "pointer" }} />
        <div className={`user-dropdown ${showDropdown ? "show" : ""}`}>
          <div className="dropdown-item" onClick={logout}>
            <FiLogOut size={18} />
            Logout
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ onAuthButtonClick }) {
  const router = useRouter();
>>>>>>> 911c895 (Initial Mask commit)
  const handleClick = (e, type) => {
    e.preventDefault();
    onAuthButtonClick(type);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
<<<<<<< HEAD
      <div className="logo-container">
=======
      <div className="logo-container2" onClick={() => router.push("/student")}>
>>>>>>> 911c895 (Initial Mask commit)
        <Image
          src={logo}
          alt="Graid Logo"
          className="navbar-logo"
<<<<<<< HEAD
          width={60}
          height={60}
        />
        <Link href="/" className="logo-text">
=======
          // width={60}
          // height={60}
        />
        <Link href="/" className="logo-text2">
>>>>>>> 911c895 (Initial Mask commit)
          <span>gr</span>
          <span className="blue">ai</span>
          <span>d</span>
          <span className="blue">.</span>
        </Link>
      </div>
<<<<<<< HEAD

      {/* Search bar */}
      <div
        style={{
          width: "60%",
          height: "fit-content",
          backgroundColor: "#181818",
          borderRadius: "10px",
        }}
      >
        <ReactSearchAutocomplete
          //   items={courses.map((course) => ({
          //     id: course.id,
          //     name: course.name,
          //   }))}
          onSearch={handleOnSearch}
          onSelect={handleOnSelect}
          formatResult={formatResult}
          placeholder="Search courses..."
          styling={{
            backgroundColor: "transparent",
            border: "1px solid #333",
            borderRadius: "4px",
            color: "white",
            height: "40px",
            placeholderColor: "gray",
            hoverBackgroundColor: "#333",
            fontSize: "16px",
            iconColor: "#3b82f6", // Blue color for search icon
          }}
        />
      </div>
=======
      <SearchBar />

>>>>>>> 911c895 (Initial Mask commit)
      <NavIcons />
    </nav>
  );
}
