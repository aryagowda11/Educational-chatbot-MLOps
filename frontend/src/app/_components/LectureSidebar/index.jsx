"use client";

import { useRouter } from "next/navigation";
import styles from "./LectureSidebar.module.css";

export default function LectureSidebar({ courseStructure, activeLecture }) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/student");
  };

  const handleLectureClick = (lecture) => {
    // You can implement navigation to specific lecture
    console.log("Lecture clicked:", lecture);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.backButton} onClick={handleBackClick}>
        ← Back to Courses
      </div>

      <div className={styles.courseNav}>
        {courseStructure.map((professor, idx) => (
          <div key={idx} className={styles.professorSection}>
            <div className={styles.professorName}>{professor.title}</div>

            {professor.courses.map((course, courseIdx) => (
              <div key={courseIdx} className={styles.courseSection}>
                <div className={styles.courseName}>{course.name}</div>

                {course.lectures.map((lecture, lectureIdx) => (
                  <div
                    key={lectureIdx}
                    className={`${styles.lecture} ${
                      activeLecture === lecture ? styles.activeLecture : ""
                    }`}
                    onClick={() => handleLectureClick(lecture)}
                  >
                    {lecture}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.settings}>
        <span>Settings</span>
      </div>
    </aside>
  );
}
