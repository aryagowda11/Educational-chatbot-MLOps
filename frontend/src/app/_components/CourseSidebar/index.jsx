"use client";

import { useState } from "react";
import styles from "./index.module.css";
import { Inter } from "next/font/google";
import { Typography } from "@mui/material";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function CourseSidebar({ courses }) {
  const firstname = sessionStorage.getItem("firstname");

  const [user] = useState({
    name: firstname,
    initial: firstname?.charAt(0).toUpperCase(),
  });

  // render username with styled middle character
  // const renderStyledUsername = (name) => {
  //   if (!name || name.length < 5) {
  //     return <span className={styles.userName}>Hi {name},</span>;
  //   }

  //   const mid = Math.floor(name.length / 2);
  //   const middleStart = mid - 1;
  //   const middleEnd = mid + 1;

  //   const start = name.slice(0, middleStart);
  //   const middle = name.slice(middleStart, middleEnd);
  //   const end = name.slice(middleEnd);

  //   return (
  //     <span className={styles.userName}>
  //       Hi <span style={{ color: "white" }}>{start}</span>
  //       <span style={{ color: "#3b82f6" }}>{middle}</span>
  //       <span style={{ color: "white" }}>{end}</span>,
  //     </span>
  //   );
  // };

  return (
    <aside className={`${styles.sidebar} ${inter.className}`}>
      {user && (
        <div className={styles.userInfo}>
          {user.name && <Typography variant="h6">Hi {user.name},</Typography>}
        </div>
      )}

      <nav className={styles.navigation}>
        <div className={styles.navSection}>
          <h3>All Courses</h3>
          {/* {courses.map((course, courseIdx) => (
            <ul key={courseIdx}>
              <li>{course.title}</li>
            </ul>
          ))} */}
          <ul>
            <li>Prof1</li>
          </ul>
        </div>

        {/* <div className={styles.navSection}>
          <ul>
            <li>Favorites</li>
            <li>Watch Later</li>
            <li>History</li>
          </ul>
        </div>

        <div className={styles.settings}>
          <span>Settings</span>
        </div> */}
      </nav>
    </aside>
  );
}
