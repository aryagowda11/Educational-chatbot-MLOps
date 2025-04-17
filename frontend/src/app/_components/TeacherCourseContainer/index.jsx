"use client";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
<<<<<<< HEAD
import LectureCard from "@/app/_components/LectureCard/LectureCard";
import UploadModal from "@/app/_components/UploadModal/UploadModal";

export default function TeacherCourseContainer({ courseId }) {
  const [lectures, setLectures] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
=======
import LectureCard from "@/app/_components/LectureCard";
import UploadModal from "@/app/_components/UploadModal";
import { useAuth } from "@/app/_context/AuthContext";
import StudentAdditionContainer from "@/app/_components/StudentAdditionContainer";
import { useSearchParams } from "next/navigation";

export default function TeacherCourseContainer() {
  const [lectures, setLectures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseName, setCourseName] = useState(null);
  const { checkTokenExpiration } = useAuth();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
>>>>>>> 911c895 (Initial Mask commit)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUpload = (newLecture) => {
    setLectures([...lectures, { ...newLecture, id: lectures.length + 1 }]);
    closeModal();
  };

  useEffect(() => {
<<<<<<< HEAD
=======
    checkTokenExpiration();
    //TODO: ADD to hook
>>>>>>> 911c895 (Initial Mask commit)
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
<<<<<<< HEAD
=======

    //TODO: Get course name from lecture api
    if (courseId) {
      const token = sessionStorage.getItem("access_token");
      fetch(`${process.env.NEXT_PUBLIC_API_URL}courses/${courseId}/course`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCourseName(data.title);
        });
    }
>>>>>>> 911c895 (Initial Mask commit)
  }, []);

  return (
    <div className={styles.container}>
<<<<<<< HEAD
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
=======
      {courseName && (
        <div className={styles.header}>
          <h1>{courseName}</h1>
        </div>
      )}

      <div className={styles.contentWrapper}>
        <div className={styles.lectureGrid}>
          <LectureCard key="#4565" openModal={openModal} />
          {lectures.length > 0 &&
            lectures?.map((lecture) => (
              <LectureCard key={lecture.id} lecture={lecture} />
            ))}
        </div>
        <StudentAdditionContainer courseId={courseId} />
>>>>>>> 911c895 (Initial Mask commit)
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
