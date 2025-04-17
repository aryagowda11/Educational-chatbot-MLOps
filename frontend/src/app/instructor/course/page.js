"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "./index.module.css";
import Navbar from "@/app/_components/Navbar/index";
import TeacherCourseContainer from "@/app/_components/TeacherCourseContainer";
import ProtectedRoute from "@/app/_components/ProtectedRoute";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// Main page component with Suspense
export default function CoursePage() {
  return (
    <div className={`${styles.container} ${inter.className}`}>
      <Navbar />
      <Suspense fallback={<div>Loading course content...</div>}>
        <ProtectedRoute>
          <TeacherCourseContainer />
        </ProtectedRoute>
      </Suspense>
    </div>
  );
}
