"use client";
import { useState } from "react";
import styles from "./index.module.css";

const ChatComponent = ({ courseId, getCurrentTime, videoId, lectureData }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!question.trim()) return;

    setIsLoading(true);
    const token = sessionStorage.getItem("access_token");
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInNjb3BlcyI6W10sInJvbGVfaWQiOjMsIm9yZ19pZCI6MSwiaXNzIjoiZ3JhaWQtYXV0aC1zZXJ2aWNlIiwiYXVkIjoiZ3JhaWQtY2xpZW50LWFwcCIsImlhdCI6MTc0MTkxNjA4NywiZXhwIjoxNzQxOTE3ODg3LCJqdGkiOiJGUFFreGNLMTNUclg4ZmcwNml5Ykd4Rm9IbU8zdnlidVBzdUItaWFyWmc4In0.bEeBFOjfCsTQxIyCmDpobqrM8VnxomCK8ABuP2XInoE";
    const userId = sessionStorage.getItem("user_id");
    const timestamp = 200;
    const userMessage = question; // Store question before clearing input
    const url =
      "https://my-service-193050266767.us-east4.run.app/chatbot/execute";

    // Add user message immediately
    setMessages((prevMessages) => [
      ...prevMessages,
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
    </aside>
  );
};

export default ChatComponent;
