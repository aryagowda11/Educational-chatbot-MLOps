"use client";
<<<<<<< HEAD
import { useState } from "react";
import styles from "./index.module.css";

const ChatComponent = ({ courseId, getCurrentTime, videoId, lectureData }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!question.trim()) return;
=======
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import Logo from "@/app/assets/logo_loading.svg";
import Image from "next/image";
import QAplaceholder from "./QAplaceholder";
import { splitTextWithMath } from "@/app/utils/splitTextWithMath";
import Latex from "react-latex-next";
import ChatInput from "./ChatInput";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// component for reasoning typing indicator
const TypingIndicator = () => {
  return (
    <div className={styles.typingIndicator}>
      <span className={styles.text1}>Rea</span>
      <span className={styles.text2}>son</span>
      <span className={styles.text3}>ing</span>
    </div>
  );
};

const ChatComponent = ({ courseId, getCurrentTime, videoId, lectureData }) => {
  const [socket, setSocket] = useState(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);
  const [graidmessageLoading, setGraidMessageLoading] = useState(false);
  const [dotmenuvisible, setDotmenuvisible] = useState(false);
  const [activefontsize, setActivefontsize] = useState("small");
  const dotmenuRef = useRef(null);

  // useEffect to establish socket connection and handle messages
  useEffect(() => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return;
  
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_API_URL}ws/chat?token=${token}`);
  
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(ws);
    };
  
    ws.onerror = (error) => {
      console.log("WebSocket error:", error);
    };
  
    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      const data = JSON.parse(event.data);
      if (data.response) {
        setGraidMessageLoading(true);
        handleGraidResponse(data.response);
      } else if (data.error) {
        setMessages((prev) => [
          ...prev,
          { user: "graid.", message: "Error: " + data.error },
        ]);
      }
      setIsLoading(false);
    };
  
    return () => {
      ws.close();
    };
  }, [])
 
  useEffect(() => {
    // Function to close the dotmenu when clicking outside
    const handleClickOutside = (event) => {
      if (dotmenuRef.current && !dotmenuRef.current.contains(event.target)) {
        setDotmenuvisible(false);
      }
    };

    // Add event listener to document to listen for clicks
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  // useEffect to scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (
      messages.length > 0 &&
      chatScrollRef.current &&
      messagesEndRef.current
    ) {
      const container = chatScrollRef.current;
      const endEl = messagesEndRef.current;
      const shouldScroll =
        container.scrollTop + container.clientHeight + 100 >=
        container.scrollHeight;

      if (shouldScroll) {
        endEl.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }
  }, [messages]);

  const handleSend = () => {
    if (!question.trim() || !socket || socket.readyState !== WebSocket.OPEN) return;
>>>>>>> 911c895 (Initial Mask commit)

    setIsLoading(true);
    const token = sessionStorage.getItem("access_token");
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInNjb3BlcyI6W10sInJvbGVfaWQiOjMsIm9yZ19pZCI6MSwiaXNzIjoiZ3JhaWQtYXV0aC1zZXJ2aWNlIiwiYXVkIjoiZ3JhaWQtY2xpZW50LWFwcCIsImlhdCI6MTc0MTkxNjA4NywiZXhwIjoxNzQxOTE3ODg3LCJqdGkiOiJGUFFreGNLMTNUclg4ZmcwNml5Ykd4Rm9IbU8zdnlidVBzdUItaWFyWmc4In0.bEeBFOjfCsTQxIyCmDpobqrM8VnxomCK8ABuP2XInoE";
    const userId = sessionStorage.getItem("user_id");
<<<<<<< HEAD
    const timestamp = 200;
    const userMessage = question; // Store question before clearing input
    const url =
      "https://my-service-193050266767.us-east4.run.app/chatbot/execute";
=======
    const username = sessionStorage.getItem("username");
    const timestamp = getCurrentTime();
    const userMessage = question; // Store question before clearing input
    // const url = "https://my-service-193050266767.us-east4.run.app/chatbot/execute";
>>>>>>> 911c895 (Initial Mask commit)

    // Add user message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
<<<<<<< HEAD
      { user: "userName", message: userMessage },
    ]);
    setQuestion(""); // Clear input

    fetch(`${process.env.NEXT_PUBLIC_API_URL}chatbot/execute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        course_id: courseId,
        question: userMessage,
        timestamp: timestamp,
        video_description: lectureData.description,
        end_session: false,
        video_id: videoId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Use functional update to ensure we're working with latest state
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: "gr.aid", message: data.response },
        ]);
      })
      .catch((error) => {
        console.error("Chat error:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            user: "gr.aid",
            message: "Sorry, there was an error processing your request.",
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <aside className={styles.chatSidebar}>
      <div className={styles.chatHeader}>
        <div className={styles.chatControls}>
          <span>↻</span>
          <span>✕</span>
        </div>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg, idx) => (
          <div key={idx} className={styles.messageContainer}>
            <div className={styles.messageUser}>{msg.user}</div>
            <div className={styles.messageContent}>{msg.message}</div>
          </div>
        ))}
        {isLoading && (
          <div className={styles.messageContainer}>
            <div className={styles.messageContent}>Thinking...</div>
          </div>
        )}
      </div>
      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="ask graid bot"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
        />
        <button disabled={!question.trim() || isLoading} onClick={handleSend}>
          ↑
        </button>
      </div>
=======
      {
        user: username === undefined ? "username" : username,
        message: userMessage,
      },
    ]);
    setQuestion(""); // Clear input
    setIsLoading(true);

    socket.send(
      JSON.stringify({
        course_id: courseId,
        video_id: videoId,
        question: userMessage,
        timestamp: timestamp,
        video_description: lectureData.description,
      })
    );  
    
  };

  const handleGraidResponse = (message) => {
    const words = message.split(" ");
    let index = 0;

    // Step 1: First, add the initial empty message.
    setMessages((prevMessages) => [
      ...prevMessages,
      { user: "graid.", message: words[0] }, // Start with the first word
    ]);

    // index = 1; // Start from the second word

    // Step 2: Delay the interval slightly to allow state update
    setTimeout(() => {
      const interval = setInterval(() => {
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];

          if (index < words.length) {
            return [
              ...prevMessages.slice(0, -1),
              {
                ...lastMessage,
                message: lastMessage.message + " " + words[index], // Append words correctly
              },
            ];
          } else {
            setGraidMessageLoading(false);
            clearInterval(interval);
            return prevMessages;
          }
        });

        index++;
      }, 50); // 50ms per word
    }, 10); // Short delay to allow initial state update
  };

  return (
    <aside className={`${styles.chatSidebar} ${inter.className}`}>
      <div className={styles.chatHeader}>
        <div className={styles.chatControls}>
          <button
            className="dotmenuBtn"
            style={{ backgroundColor: "transparent", border: "0px" }}
            onClick={() => setDotmenuvisible(!dotmenuvisible)}
          >
            <img alt="Menu" src="/assets/images/three-dot-icon.svg" />
          </button>
          {dotmenuvisible && (
            <div className={styles.dotmenuContainer} ref={dotmenuRef}>
              <div style={{ display: "flex" }}>
                <p>Font Size</p>
                <div className={styles.fontSizeOptions}>
                  <span
                    className={`${styles.small} ${
                      activefontsize === "small" ? styles.active : ""
                    }`}
                    onClick={() => setActivefontsize("small")}
                  >
                    Aa
                  </span>
                  <span
                    className={`${styles.medium} ${
                      activefontsize === "medium" ? styles.active : ""
                    }`}
                    onClick={() => setActivefontsize("medium")}
                  >
                    Aa
                  </span>
                  <span
                    className={`${styles.large} ${
                      activefontsize === "large" ? styles.active : ""
                    }`}
                    onClick={() => setActivefontsize("large")}
                  >
                    Aa
                  </span>
                </div>
              </div>
            </div>
          )}
          <div className={styles.chatControlsIcons}>
            <button
              style={{
                backgroundColor: "transparent",
                border: "0px",
                cursor: "pointer",
              }}
              disabled={isLoading || graidmessageLoading}
              onClick={() => {
                setMessages([]);
                setQuestion("");
              }}
              title="Restart Chat"
            >
              <img alt="Frame" src="/assets/images/clear-icon.svg" />
            </button>
          </div>
        </div>
      </div>
      {messages.length === 0 ? (
        <QAplaceholder />
      ) : (
        <div className={styles.chatMessages} ref={chatScrollRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={styles.messageContainer}>
              <div
                className={styles.messageUser}
                style={{
                  color:
                    msg.user === "graid." ? "#3b82f6" : "rgb(151, 151, 151)",
                  paddingBottom: "3px",
                  borderBottom: `1px solid ${
                    msg.user === "graid." ? "#3b82f6" : "rgb(151, 151, 151)"
                  }`,
                  fontSize:
                    activefontsize === "small"
                      ? "0.6rem"
                      : activefontsize === "medium"
                      ? "0.8rem"
                      : "1rem",
                }}
              >
                {msg.user}
              </div>
              <div
                className={styles.messageContent}
                style={{
                  fontSize:
                    activefontsize === "small"
                      ? "0.6rem"
                      : activefontsize === "medium"
                      ? "0.8rem"
                      : "1rem",
                }}
              >
                {splitTextWithMath(msg.message).map((segment, i) =>
                  segment.type === "math" ? (
                    <Latex>{segment.content}</Latex>
                  ) : (
                    <span key={i}>{segment.content}</span>
                  )
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className={styles.messageContainer}>
              <TypingIndicator />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <ChatInput
        textareaRef={textareaRef}
        question={question}
        setQuestion={setQuestion}
        handleSend={handleSend}
        isLoading={isLoading}
      />
>>>>>>> 911c895 (Initial Mask commit)
    </aside>
  );
};

export default ChatComponent;
