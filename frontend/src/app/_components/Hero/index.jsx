"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import "./index.css";
import About from "./About";
import Contact from "./Contact";

export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [activeSection, setActiveSection] = useState("hero-section");
  const text = "FUTURE OF LEARNING IS HERE";

  useEffect(() => {
    setIsMounted(true);
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Cursor blinks every 500ms
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (isMounted) {
      let i = 0;
      const typingInterval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1)); // Slice text instead of appending
        i++;
        if (i === text.length) {
          clearInterval(typingInterval);
        }
      }, 80); // Typing speed
      return () => clearInterval(typingInterval);
    }
  }, [isMounted]);

  useEffect(() => {
    const handleScroll = (event) => {
      event.preventDefault(); // Prevent default scroll behavior

      const heroSection = document.getElementById("hero-section");
      const aboutSection = document.getElementById("about-section");
      const contactSection = document.getElementById("contact-section");

      if (event.deltaY > 0) {
        // Scroll down
        if (heroSection?.getBoundingClientRect().bottom > 0) {
          aboutSection?.scrollIntoView({ behavior: "smooth" });
        } else if (aboutSection?.getBoundingClientRect().bottom > 0) {
          contactSection?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (event.deltaY < 0) {
        // Scroll up
        if (contactSection?.getBoundingClientRect().top < window.innerHeight) {
          aboutSection?.scrollIntoView({ behavior: "smooth" });
        } else if (aboutSection?.getBoundingClientRect().top < window.innerHeight) {
          heroSection?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    return () => window.removeEventListener("wheel", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      threshold: 0.6, // Trigger when at least 60% of the section is visible
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Update active section based on visible section
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ["hero-section", "about-section", "contact-section"];
    sections.forEach((id) => {
      const sectionElement = document.getElementById(id);
      if (sectionElement) observer.observe(sectionElement);
    });

    return () => observer.disconnect(); // Cleanup observer on component unmount
  }, []);

  if (!isMounted) {
    return null; // or a loading state
  }

  return (
    <div>
      <AnimatePresence>
        <div className="hero" id="hero-section">
          <h1 className="hero-text">
            {displayedText}
            <motion.span className="typing-cursor">
              {showCursor ? "." : ""}
            </motion.span>
          </h1>
        </div>
      </AnimatePresence>
      <About />
      <Contact />
    </div>
  );
}
