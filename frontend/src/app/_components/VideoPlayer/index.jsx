"use client";
<<<<<<< HEAD

import React, { useRef, useEffect, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

function VideoPlayer(props) {
  const videoRef = useRef(null);
  const { options, playerRef } = props;

  const onReady = useCallback(
    (player) => {
      playerRef.current = player;

      // You can handle player events here, for example:
      player.on("waiting", () => {
        videojs.log("player is waiting");
      });

      player.on("dispose", () => {
        videojs.log("player will dispose");
      });
    },
    [playerRef]
  );

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, options, () => {
        videojs.log("player is ready");
        onReady && onReady(player);
      }));

      // You could update an existing player in the `else` block here
      // on prop change, for example:
    } else {
      const player = playerRef.current;

      player.autoplay(options.autoplay);
      player.src(options.sources);
    }
  }, [options, videoRef, onReady, playerRef]);

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
}
=======
import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import styles from "../StudentCourseContainer/index.module.css";

const VideoPlayer = ({ src, playerRef, onToggleChat, showChat, chatProps }) => {
  const localRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (playerRef) {
      playerRef.current = {
        getCurrentTime: () => localRef.current?.getCurrentTime() || 0,
      };
    }

    const handleFullscreenChange = () => {
      const fullscreenEl = document.fullscreenElement;
      setIsFullscreen(fullscreenEl === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(containerRef.current);
    }
  }

  return (
    <div ref={containerRef} className={styles.reactVideoPlayer}>
      <ReactPlayer
        ref={localRef}
        controls={true}
        url={src}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: 0, left: 0, borderRadius: "15px" }}
      />
      <button onClick={toggleFullscreen} className={styles.fullscreenButton}>
        {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      </button>
      {isFullscreen && (
        <>
          <button onClick={onToggleChat} className={styles.chatToggleButton}>
            💬 {showChat ? "Hide Chat" : "Show Chat"}
          </button>
          {showChat && (
            <div className={styles.chatOverlay}>
              <chatProps.ChatComponent
                courseId={chatProps.courseId}
                getCurrentTime={chatProps.getCurrentTime}
                videoId={chatProps.videoId}
                lectureData={chatProps.lectureData}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
>>>>>>> 911c895 (Initial Mask commit)

export default VideoPlayer;
