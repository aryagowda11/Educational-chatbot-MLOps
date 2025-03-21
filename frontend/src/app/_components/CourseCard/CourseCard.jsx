"use client";

import styles from "./CourseCard.module.css";

export default function CourseCard({ course, onClick }) {
  return (
    <div className={styles.courseCard} onClick={() => onClick(course)}>
      <div className={styles.videoCount}>{course.videoCount} videos</div>
      <div className={styles.courseName}>{course.title}</div>
    </div>
  );
}
