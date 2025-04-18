"use client";
import React, { useState } from "react";
import "./index.css";
import { Inter } from "next/font/google";
import { Download } from "lucide-react";

export const NoteComponent = () => {
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };
  // Function to download the note as a .txt file
  const downloadNote = () => {
    const element = document.createElement("a");
    const file = new Blob([`Title: ${title}\n\n${note}`], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = "note.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div display="flex" className="note-header">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          className="note-title"
        />
        <Download
          onClick={downloadNote}
          style={{
            color: "#979797",
          }}
        />
      </div>
      <textarea
        placeholder="Write your note here..."
        value={note}
        onChange={handleNoteChange}
        className="note-textarea"
      />
    </>
  );
};
