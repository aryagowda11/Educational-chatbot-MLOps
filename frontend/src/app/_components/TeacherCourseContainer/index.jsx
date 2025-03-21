"use client";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import LectureCard from "@/app/_components/LectureCard/LectureCard";
import UploadModal from "@/app/_components/UploadModal/UploadModal";

export default function TeacherCourseContainer({ courseId }) {
  const [lectures, setLectures] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpload = (newLecture) => {
    setLectures([...lectures, { ...newLecture, id: lectures.length + 1 }]);
    closeModal();
  };

  useEffect(() => {
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
      setLectures(data);
    };
    fetchLectures(courseId);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Course Lectures</h1>
        <button className={styles.addButton} onClick={openModal}>
          + Add New Lecture
        </button>
      </div>

      <div className={styles.lectureGrid}>
        {lectures.length > 0 &&
          lectures?.map((lecture) => (
            <LectureCard key={lecture.id} lecture={lecture} />
          ))}
      </div>

      {isModalOpen && (
        <UploadModal
          onClose={closeModal}
          onUpload={handleUpload}
          courseId={courseId}
        />
      )}
    </div>
  );
}
