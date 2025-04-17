"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/app/_components/CourseCard";
import styles from "./index.module.css";
import { FaTimes } from "react-icons/fa";
import { UserRound } from "lucide-react";

export default function CourseGrid({ courses }) {
  const router = useRouter();
  const [roleId, setRoleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedRoleId = sessionStorage.getItem("role_id");
    setRoleId(storedRoleId);
  }, []);

  // const fetchLectures = async (courseId) => {
  //   const token = sessionStorage.getItem("access_token");
  //   const response = await fetch(
  //     `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${courseId}/lectures`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //     }
  //   );
  //   const data = await response.json();
  //   console.log(data);
  //   return data;
  // };
  const handleCourseClick = async (course) => {
    try {
      // const lectureList = await fetchLectures(course.course_id);
      // if (!lectureList) {
      //   throw new Error("No lectures found");
      // }

      // // Log the data before encoding
      // console.log("Course ID:", course.course_id);
      // console.log("Lecture List:", lectureList);

      // const encodedLectures = encodeURIComponent(JSON.stringify(lectureList));
      const roleId = sessionStorage.getItem("role_id");
      if (roleId === "3") {
        router.push(`/student/course?courseId=${course.course_id}`);
      } else {
        router.push(`/instructor/course?courseId=${course.course_id}`);
      }
    } catch (error) {
      console.error("Error in handleCourseClick:", error);
      // Handle error (show message to user, etc.)
    }
  };

  const handleAddCourse = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCourseSubmit = (newCourse) => {
    // Refresh the courses list or add the new course to the existing list
    router.refresh();
  };

  return (
    <div className={styles.courseContent}>
      <div className={styles.courseProfHeader}>
        <UserRound size={32} className={styles.courseUserIcon} />
        <h2 style={{padding:"5px", fontSize:"24px"}}>Prof1</h2>
      </div>
      <div className={styles.courseGrid}>
        {courses.map((course, courseIdx) => (
          <CourseCard
            key={courseIdx}
            course={course}
            onClick={handleCourseClick}
          />
        ))}
        {roleId === "2" && (
          <button className={styles.courseAddButton} onClick={handleAddCourse}>
            Add Course
          </button>
        )}
      </div>
      {isModalOpen && (
        <CourseModal onClose={handleModalClose} onSubmit={handleCourseSubmit} />
      )}
    </div>
  );
}

const CourseModal = ({ onClose, onSubmit }) => {
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    category: "",
    thumbnail: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("access_token");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}courses/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: courseData.name,
            description: courseData.description,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create course");
      }

      const data = await response.json();
      onSubmit(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCourseData((prev) => ({
        ...prev,
        thumbnail: e.target.files[0],
      }));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Add New Course</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Course Name</label>
            <input
              type="text"
              id="name"
              value={courseData.name}
              onChange={(e) =>
                setCourseData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter course name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={courseData.description}
              onChange={(e) =>
                setCourseData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter course description"
              rows={4}
              required
            />
          </div>

          {/* <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={courseData.category}
              onChange={(e) =>
                setCourseData((prev) => ({ ...prev, category: e.target.value }))
              }
              required
            >
              <option value="">Select a category</option>
              <option value="programming">Programming</option>
              <option value="data-science">Data Science</option>
              <option value="machine-learning">Machine Learning</option>
              <option value="web-development">Web Development</option>
            </select>
          </div> */}

          {/* <div className={styles.formGroup}>
            <label>Course Thumbnail</label>
            <div className={styles.fileInput}>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {courseData.thumbnail && (
                <p className={styles.fileName}>{courseData.thumbnail.name}</p>
              )}
            </div>
          </div> */}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                isLoading || !courseData.name || !courseData.description
              }
            >
              {isLoading ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
