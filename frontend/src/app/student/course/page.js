"use client";
<<<<<<< HEAD
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./CoursePage.module.css";
import Navbar from "@/app/_components/Navbar/index";
import StudentCourseContainer from "@/app/_components/StudentCourseContainer";
import TeacherCourseContainer from "@/app/_components/TeacherCourseContainer";

// Create a separate component for the course content
function CourseContent() {
  const [roleId, setRoleId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lectures, setLectures] = useState([]);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");

  const fetchLectures = async (courseId) => {
    const token = sessionStorage.getItem("access_token");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}videos/courses/${courseId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
    return data;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && courseId) {
      try {
        const storedRoleId = sessionStorage.getItem("role_id");
        setRoleId(storedRoleId);
        fetchLectures(courseId).then((data) => {
          setLectures(data);
        });
      } catch (error) {
        console.error("Error accessing sessionStorage:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  console.log("CourseId:", courseId);
  console.log("Lectures:", lectures);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!courseId) {
    return <div>Course not found</div>;
  }

  return (
    <>
      {roleId === "3" ? (
        <StudentCourseContainer courseId={courseId} lectures={lectures} />
      ) : (
        <TeacherCourseContainer courseId={courseId} />
      )}
    </>
  );
}
=======
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./index.module.css";
import Navbar from "@/app/_components/Navbar/index";
import StudentCourseContainer from "@/app/_components/StudentCourseContainer";
import ProtectedRoute from "@/app/_components/ProtectedRoute";
>>>>>>> 911c895 (Initial Mask commit)

// Main page component with Suspense
export default function CoursePage() {
  return (
    <div className={styles.container}>
      <Navbar />
      <Suspense fallback={<div>Loading course content...</div>}>
<<<<<<< HEAD
        <CourseContent />
=======
        <ProtectedRoute>
          <StudentCourseContainer />
        </ProtectedRoute>
>>>>>>> 911c895 (Initial Mask commit)
      </Suspense>
    </div>
  );
}
