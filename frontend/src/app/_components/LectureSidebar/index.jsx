"use client";

<<<<<<< HEAD
import { useRouter } from "next/navigation";
import styles from "./LectureSidebar.module.css";

export default function LectureSidebar({ courseStructure, activeLecture }) {
=======
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import styles from "./index.module.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export default function LectureSidebar({
  courseStructure,
  activeLectureIndex,
  setActiveLectureIndex,
}) {
>>>>>>> 911c895 (Initial Mask commit)
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/student");
  };

<<<<<<< HEAD
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
=======
  const handleLectureClick = (lectureIdx) => {
    setActiveLectureIndex(lectureIdx);
  };

  return (
    <aside className={`${styles.sidebar} ${inter.className}`}>
      {/* <div className={styles.backButton} onClick={handleBackClick}>
        ← Back to Courses
      </div> */}

      <div className={styles.courseNav}>
        {courseStructure &&
          courseStructure.map((professor, idx) => (
            <div key={idx} className={styles.professorSection}>
              <div className={styles.professorName}>{professor.title}</div>

              {professor.courses.map((course, courseIdx) => (
                <div key={courseIdx} className={styles.courseSection}>
                  <div className={styles.courseName}>{course.name}</div>

                  {course.lectures.map((lecture, lectureIdx) => (
                    <div
                      key={lectureIdx}
                      className={`${styles.lecture} ${
                        lectureIdx === activeLectureIndex
                          ? styles.activeLecture
                          : ""
                      }`}
                      onClick={() => handleLectureClick(lectureIdx)}
                    >
                      {lecture}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
      </div>
      {/* <div className={styles.settings}>
        <span>Settings</span>
      </div> */}
>>>>>>> 911c895 (Initial Mask commit)
    </aside>
  );
}
