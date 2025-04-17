"use client";
import { Inter } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
import logo from "@/app/assets/loading.svg";
import Image from "next/image";

const QAplaceholder = () => {
  return (
    <aside className={`${styles.emptyChatSidebar}`}>
      <div className={styles.chatMessages}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "-webkit-fill-available",
            gap: "1rem",
            marginTop: "-20%",
          }}
        >
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              opacity: "0.8",
            }}
          />
          <h4
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginLeft: "auto",
              marginRight: "auto",
              opacity: "0.8",
              fontFamily: "Inter",
            }}
          >
            Ask graid.
          </h4>
          <p
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              opacity: "0.8",
              fontFamily: "Inter",
              fontSize: "0.7rem",
              textAlign: "center",
            }}
          >
            graid is powered by AI, so mistakes are possible. Please verify the
            information provided by graid before using it.
          </p>
        </div>
      </div>
      {/* <div className={styles.chatInput}>
        <input
          style={{
            height: "fit-content",
            padding: "0.5rem 0.5rem 0.5rem 1rem",
          }}
          type="text"
          placeholder="Ask Graid."
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isLoading}
        />
        <button
          variant="ghost"
          size="icon"
          disabled={!question.trim() || isLoading}
          onClick={handleSend}
        >
          <img alt="Send" src="/assets/images/frame-6.svg" />
        </button>
      </div> */}
    </aside>
  );
};

export default QAplaceholder;
