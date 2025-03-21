"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "@/app/assets/loading.svg";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
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
  const handleClick = (e, type) => {
    e.preventDefault();
    onAuthButtonClick(type);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo-container">
        <Image
          src={logo}
          alt="Graid Logo"
          className="navbar-logo"
          width={60}
          height={60}
        />
        <Link href="/" className="logo-text">
          <span>gr</span>
          <span className="blue">ai</span>
          <span>d</span>
          <span className="blue">.</span>
        </Link>
      </div>

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
      <NavIcons />
    </nav>
  );
}
