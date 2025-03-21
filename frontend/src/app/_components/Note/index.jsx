"use client";
import React, { useState } from "react";
import "./index.css";

const Note = () => {
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  return (
    <div className="note-container">
      <div className="note-content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
          className="note-title"
        />
        <textarea
          placeholder="Write your note here..."
          value={note}
          onChange={handleNoteChange}
          className="note-textarea"
        />
      </div>
    </div>
  );
};

export default Note;
