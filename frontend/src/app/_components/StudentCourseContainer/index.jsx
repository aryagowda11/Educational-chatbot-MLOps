<<<<<<< HEAD
import { useState, useRef, useEffect } from "react";
=======
import { useState, useRef, useEffect, useMemo } from "react";
>>>>>>> 911c895 (Initial Mask commit)
import Note from "@/app/_components/Note";
import VideoPlayer from "@/app/_components/VideoPlayer";
import LectureSidebar from "@/app/_components/LectureSidebar";
import ChatComponent from "@/app/_components/ChatComponent";
import styles from "./index.module.css";
<<<<<<< HEAD

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
=======
import { useSearchParams } from "next/navigation";

const StudentCourseContainer = () => {
  const [lecturesList, setLecturesList] = useState([]);
  const [activeLectureIndex, setActiveLectureIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const playerRef = useRef(null);
  const videoId = searchParams.get("videoId");

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
    return data;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && courseId) {
      try {
        fetchLectures(courseId).then((data) => {
          setLecturesList(data);
        });
      } catch (error) {
        console.error("Error accessing sessionStorage:", error);
      }
    }
  }, [courseId]);

  useEffect(() => {
    if (typeof window !== "undefined" && videoId) {
      const videoIndex = lecturesList.findIndex(
        (lecture) => lecture.video_id === videoId
      );
      if (videoIndex !== -1) {
        setActiveLectureIndex(videoIndex);
      }
    }
  }, [videoId, lecturesList]);

  const courseStructure = useMemo(() => {
    if (lecturesList.length === 0) return [];
    const instructorName =
      lecturesList[activeLectureIndex].instructor_username || "Unknown";
    const courseName = lecturesList[activeLectureIndex].course_name;
    const lectures = lecturesList.map((lecture) => lecture.title);

    return [
      {
        title: instructorName,
        courses: [{ name: courseName, lectures }],
      },
    ];
  }, [lecturesList, activeLectureIndex]);

  // const getCurrentTime = () => {
  //   if (playerRef.current) {
  //     const time = playerRef.current.currentTime();
  //     const minutes = Math.floor(time / 60);
  //     const seconds = Math.floor(time % 60);
  //     return time;

  //     // return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  //   }

  //   return "0:00";
  // };

  const getCurrentTime = () => {
    if (playerRef.current) {
      return playerRef.current.getCurrentTime(); // this returns a promise
    }
    return 0;
  };

  const toggleChat = () => {
    setShowChat((prev) => !prev);
  };

>>>>>>> 911c895 (Initial Mask commit)
  if (lecturesList.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.contentWrapper}>
      {/* Left Sidebar */}
<<<<<<< HEAD
      <LectureSidebar courseStructure={courseStructure} />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div>
          <VideoPlayer options={videoOptions} playerRef={playerRef} />
        </div>
        <div className={styles.notesSection}>
          <Note />
=======
      <LectureSidebar
        courseStructure={courseStructure}
        activeLectureIndex={activeLectureIndex}
        setActiveLectureIndex={setActiveLectureIndex}
      />

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.videoPlayerContainer}>
          <VideoPlayer
            src={lecturesList?.[activeLectureIndex]?.url}
            playerRef={playerRef}
            onToggleChat={toggleChat}
            showChat={showChat}
            chatProps={{
              ChatComponent,
              courseId,
              getCurrentTime,
              videoId: lecturesList?.[activeLectureIndex]?.video_id,
              lectureData: lecturesList?.[activeLectureIndex],
            }}
          />
        </div>
        <div className={styles.notesSection}>
          <Note courseTitle={lecturesList?.[activeLectureIndex]?.title} courseDesc={lecturesList?.[activeLectureIndex]?.description}/>
>>>>>>> 911c895 (Initial Mask commit)
        </div>
      </main>

      {/* Right Sidebar - Chat */}
      <ChatComponent
        courseId={courseId}
        getCurrentTime={getCurrentTime}
<<<<<<< HEAD
        videoId={lecturesList?.[0]?.video_id}
        lectureData={lecturesList?.[0]}
=======
        videoId={lecturesList?.[activeLectureIndex]?.video_id}
        lectureData={lecturesList?.[activeLectureIndex]}
>>>>>>> 911c895 (Initial Mask commit)
      />
    </div>
  );
};

export default StudentCourseContainer;
