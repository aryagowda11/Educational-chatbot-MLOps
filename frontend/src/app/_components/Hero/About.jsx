"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./index.css";

export default function About() {
  const paragraphs = [
    "\"Because learning shouldn’t feel like rewinding the same lecture five times\"",
  ];

  const [displayedTexts, setDisplayedTexts] = useState(["", "", ""]);
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about-section");
      if (aboutSection) {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          setIsVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let indices = [0, 0, 0];
    
    const intervals = paragraphs.map((text, idx) =>
      setInterval(() => {
        if (indices[idx] < text.length) {
          setDisplayedTexts((prev) => {
            const newTexts = [...prev];
            newTexts[idx] = text.slice(0, indices[idx] + 1);
            return newTexts;
          });
          indices[idx]++;
        }
      }, 50)
    );

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      intervals.forEach(clearInterval);
      clearInterval(cursorInterval);
    };
  }, [isVisible]);

  return (
    <div id="about-section" className="about-container">
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="about-quote">
        <i>{displayedTexts[0]}</i>
        <motion.span className="typing-cursor">
              {showCursor ? "." : ""}
            </motion.span>
      </motion.p>
      <p>
        <span className="about-content1">Welcome to GRAID – your AI-powered study companion built for the
        modern student. We're not here to replace your professors (they're
        great!), but we are here to make sure you never miss the
        point—literally.</span><span className="about-content2"> At GRAID, we believe that video lectures should do more
        than just play; they should interact. Our platform transforms recorded
        lectures into searchable, question-ready content using advanced
        speech-to-text and natural language processing. Just ask a question, and
        GRAID responds with answers grounded in your actual course content. No
        fluff, no guesswork—just clear, contextual support.</span>
      </p>
    </div>
  );
}
