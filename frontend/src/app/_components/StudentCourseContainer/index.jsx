import { useState, useRef, useEffect } from "react";
import Note from "@/app/_components/Note";
import VideoPlayer from "@/app/_components/VideoPlayer";
import LectureSidebar from "@/app/_components/LectureSidebar";
import ChatComponent from "@/app/_components/ChatComponent";
import styles from "./index.module.css";

const StudentCourseContainer = ({ courseId, lectures }) => {
  const [lecturesList, setLecturesList] = useState([]);

  useEffect(() => {
    console.log(lectures);
    setLecturesList(lectures);
  }, [lectures]);

  const courseStructure = [
    {
      title: "Prof. Bhavya Pandey",
      courses: [
        {
          name: "Machine Learning",
          lectures: ["Lecture 1", "Lecture 2", "Lecture 3", "Lecture 4"],
        },
        {
          name: "Probability & Statistics",
          lectures: ["Lecture 1", "Lecture 2", "Lecture 3", "Lecture 4"],
        },
        {
          name: "Bayesian Statistics",
          lectures: [],
        },
        {
          name: "Linear Algebra",
          lectures: [],
        },
        {
          name: "Deep Learning",
          lectures: [],
        },
        {
          name: "Reinforcement Learning",
          lectures: [],
        },
      ],
    },
    {
      title: "Prof. Vinay Menon",
      courses: [],
    },
    {
      title: "Prof. Nikhil Reddy",
      courses: [],
    },
  ];

  const getCurrentTime = () => {
    if (playerRef.current) {
      const time = playerRef.current.currentTime();
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return time;

      // return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    return "0:00";
  };

  const playerRef = useRef(null);

  const videoOptions = {
    autoplay: true,
    controls: true,
    muted: false,
    responsive: true,
    fluid: true,
    fill: true,
    width: 800, // Set the width of the video player
    height: 250, // Set the height of the video player
    sources: [
      {
        src: lecturesList?.[0]?.url,
        type: "video/mp4",
      },
    ],
  };
  if (lecturesList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.contentWrapper}>
      {/* Left Sidebar */}
      <LectureSidebar courseStructure={courseStructure} />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div>
          <VideoPlayer options={videoOptions} playerRef={playerRef} />
        </div>
        <div className={styles.notesSection}>
          <Note />
        </div>
      </main>

      {/* Right Sidebar - Chat */}
      <ChatComponent
        courseId={courseId}
        getCurrentTime={getCurrentTime}
        videoId={lecturesList?.[0]?.video_id}
        lectureData={lecturesList?.[0]}
      />
    </div>
  );
};

export default StudentCourseContainer;
