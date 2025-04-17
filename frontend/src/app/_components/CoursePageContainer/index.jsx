"use client";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import CourseSidebar from "@/app/_components/CourseSidebar";
import CourseGrid from "@/app/_components/CourseGrid";
import { useCourses } from "@/app/_hooks/useCourses";
import Navbar from "@/app/_components/Navbar/index";
import { useAuth } from "@/app/_context/AuthContext";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function CoursePageContainer() {
  const { courses, loading, error } = useCourses();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`${styles.container} ${inter.className}`}>
      <Navbar />
      <div className={styles.contentWrapper}>
        <CourseSidebar courses={courses} />
        <main className={styles.mainContent}>
          <CourseGrid courses={courses} />
        </main>
      </div>
    </div>
  );
}
