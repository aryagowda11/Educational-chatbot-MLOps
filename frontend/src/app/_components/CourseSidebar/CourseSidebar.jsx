"use client";

import { useRouter } from "next/navigation";
import styles from "./CourseSidebar.module.css";

export default function CourseSidebar({ user, courses }) {
  const router = useRouter();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userInfo}>
        <span className={styles.userInitial}>{user.initial}</span>
        <span className={styles.userName}>{user.name}</span>
      </div>

      <nav className={styles.navigation}>
        <div className={styles.navSection}>
          <h3>All Courses</h3>
          {courses.map((course, courseIdx) => (
            <ul key={courseIdx}>
              <li>{course.title}</li>
            </ul>
          ))}
        </div>

        <div className={styles.navSection}>
          <ul>
            <li>Favorites</li>
            <li>Watch Later</li>
            <li>History</li>
          </ul>
        </div>

        <div className={styles.settings}>
          <span>Settings</span>
        </div>
      </nav>
    </aside>
  );
}
