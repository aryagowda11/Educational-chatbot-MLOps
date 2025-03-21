"use client";
import { useState } from "react";
import styles from "./StudentPage.module.css";
import CourseSidebar from "@/app/_components/CourseSidebar/CourseSidebar";
import CourseGrid from "@/app/_components/CourseGrid/CourseGrid";
import { useCourses } from "@/app/_hooks/useCourses";
import Navbar from "@/app/_components/Navbar/index";

export default function StudentPage() {
  const { courses, loading, error } = useCourses();
  const [user] = useState({
    name: "Anish",
    initial: "A",
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <Navbar user={user} />
      <div className={styles.contentWrapper}>
        <CourseSidebar user={user} courses={courses} />
        <main className={styles.mainContent}>
          <CourseGrid courses={courses} />
        </main>
      </div>
    </div>
  );
}
