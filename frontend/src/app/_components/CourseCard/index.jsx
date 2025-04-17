"use client";

import styles from "./index.module.css";

export default function CourseCard({ course, onClick }) {
  return (
    <div className={styles.courseCard} onClick={() => onClick(course)}>
      <div className={styles.courseName}>{course.title}</div>
      <div className={styles.videoCount}>
        {course.video_count || 0} Lectures
      </div>
    </div>
  );
}
