"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "./index.css";
import { Typography } from "@mui/material";

export const DescComponent = ({ title, desc }) => {
  return (
    <div className="desc-content">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          h3: ({ node, ...props }) => (
            <h3
              style={{
                marginTop: "1rem",
                marginBottom: "-0.4rem",
                color: "grey",
              }}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              style={{ marginTop: "0.5rem", marginLeft: "1rem" }}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong
              style={{
                display: "block",
                marginTop: "1rem",
                marginBottom: "0.2rem",
                color: "grey",
                borderBottom: "1px solid #3b82f6",
              }}
              {...props}
            />
          ),

          p: ({ node, ...props }) => (
            <p
              style={{ marginTop: "0.5rem" }}
              {...props}
            />
          ),
        }}
      >
        {desc}
      </ReactMarkdown>
    </div>
  );
};
