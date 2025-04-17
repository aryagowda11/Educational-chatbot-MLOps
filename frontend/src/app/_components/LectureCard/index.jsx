import React from "react";
import styles from "./index.module.css";
import { FaPlay, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const LectureCard = ({ lecture, openModal }) => {
  if (!lecture) {
    return (
      <div className={styles.card}>
        <div className={styles.thumbnail}>
          <div className={styles.playButton} onClick={openModal}>
            <FaPlus style={{ color: "#3b82f6" }} />
          </div>
        </div>
        <div className={styles.content}></div>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        {/* <img
          src={lecture.thumbnail || "/assets/thumbnails/default.jpg"}
          alt={lecture.title}
        /> */}
        <div className={styles.duration}>{lecture.duration}</div>
        <div className={styles.playButton}>
          <FaPlay />
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{lecture.title}</h3>
        {/* <div className={styles.actions}>
          <button className={styles.editButton}>
            <FaEdit /> Edit
          </button>
          <button className={styles.deleteButton}>
            <FaTrash /> Delete
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default LectureCard;
