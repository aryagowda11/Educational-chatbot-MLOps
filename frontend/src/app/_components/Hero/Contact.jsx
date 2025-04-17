"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import "./index.css";

export default function Contact() {
  const paragraphs = ["We are currently in Beta"];
  const members = [
    {
      fName: "Anish",
      lName: "Hegde",
      Role: "Software Engineer",
      Email: "hegde.anis@northeastern.edu",
      Linkedin: "https://www.linkedin.com/in/anish-hegde-940823120/",
    },
    {
      fName: "Ankush",
      lName: "Maheshwari",
      Role: "Software Engineer",
      Email: "maheshwari.ank@northeastern.edu",
      Linkedin: "https://www.linkedin.com/in/ankushmaheshwari/",
    },
    {
      fName: "Arya",
      lName: "Gowda",
      Role: "Data Engineer",
      Email: "lokeshgowda.a@northeastern.edu",
      Linkedin: "https://www.linkedin.com/in/arya-l-gowda/",
    },
    {
      fName: "Bhavya",
      lName: "Pandey",
      Role: "Data Scientist",
      Email: "pandey.bh@northeastern.edu",
      Linkedin: "https://www.linkedin.com/in/bhavypandey/",
    },
    {
      fName: "Nikhil",
      lName: "Reddy",
      Role: "AI Engineer",
      Email: "bommareddy.n@northeastern.edu",
      Linkedin: "https://www.linkedin.com/in/nikhileshwar-reddy-bommareddy/",
    },
    {
      fName: "Vinay",
      lName: "Menon",
      Role: "Software Engineer",
      Email: "rajagopalmenon.v@northeastern.edu",
      Linkedin: "https://www.linkedin.com/in/vinay-r-menon/",
    },
  ];

  const [displayedTexts, setDisplayedTexts] = useState(["",]);
  const [showCursor, setShowCursor] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
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
      }, 80)
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
    
    <div id="contact-section" className="contact-container">
      <div className="contact-grid-container">
        {members.map((member, index) => (
          <div className="contact-card" key={index}>
            <div className="name-info-container">
                <h2 className="fname-text">{member.fName}</h2>
                <h2 className="lname-text" style={{color: '#3b82f6', fontSize: "2rem", fontWeight: 'bold'}}>{member.lName}</h2>
            </div>
            <div className="contact-info-container">
                <p className="role-text">{member.Role}</p>
                <p className="email-text">{member.Email}</p>
                <a href={member.Linkedin} target="_blank" rel="noopener noreferrer" className="linkedin-text">
                LinkedIn
                </a>
            </div>
          </div>
        ))}
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="contact-title">
        {displayedTexts[0]}
        <motion.span className="typing-cursor">
              {showCursor ? "." : ""}
            </motion.span>
      </motion.p>
      <p>This means that there could be bugs and features missing. Please report any bugs or wanted features to <span style={{color:'#3b82f6'}}>lokeshgowda.a@northeastern.edu</span> </p>
    </div>
  );
}
