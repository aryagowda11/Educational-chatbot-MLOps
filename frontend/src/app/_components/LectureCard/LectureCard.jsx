import React from "react";
import styles from "./LectureCard.module.css";
import { FaPlay, FaEdit, FaTrash } from "react-icons/fa";

const LectureCard = ({ lecture }) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <img
          src={lecture.thumbnail || "/assets/thumbnails/default.jpg"}
          alt={lecture.title}
        />
        <div className={styles.duration}>{lecture.duration}</div>
        <div className={styles.playButton}>
          <FaPlay />
        </div>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{lecture.title}</h3>
        <div className={styles.actions}>
          <button className={styles.editButton}>
            <FaEdit /> Edit
          </button>
          <button className={styles.deleteButton}>
            <FaTrash /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LectureCard;
