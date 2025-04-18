import React, { useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { ArrowRight, Mic } from "lucide-react";
import styles from "./index.module.css";

const ChatInput = ({
  handleSend,
  isLoading,
  question,
  setQuestion,
  textareaRef,
}) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
      if (textareaRef.current) {
        textareaRef.current.style.height = "37px";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }
  }, [transcript]);

  const handleVoiceInput = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: false, language: "en-US" });
  };

  const handleTextSend = () => {
    handleSend();
    setQuestion("");
    resetTranscript();
    if (textareaRef.current) {
      textareaRef.current.style.height = "37px";
    }
  };

  return (
    <div className={styles.chatInput}>
      <textarea
        ref={textareaRef}
        placeholder="Ask Graid."
        value={question}
        onChange={(e) => {
          setQuestion(e.target.value);
          if (textareaRef.current) {
            textareaRef.current.style.height = "37px";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleTextSend();
          }
        }}
        disabled={isLoading}
      />
      <button onClick={handleVoiceInput} disabled={isLoading}>
        <Mic color={listening ? "#3f82b6" : "#979797"} size={20} />
      </button>
      <button
        variant="ghost"
        size="icon"
        disabled={!question.trim() || isLoading}
        onClick={handleTextSend}
      >
        <ArrowRight color="#3f82b6" />
      </button>
    </div>
  );
};

export default ChatInput;
