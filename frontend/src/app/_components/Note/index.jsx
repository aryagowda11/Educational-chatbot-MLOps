"use client";
import React, { useState } from "react";
import "./index.css";
<<<<<<< HEAD

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
=======
import { Inter } from "next/font/google";
import { NoteComponent } from "./NoteComponent";
import { DescComponent } from "./DescComponent";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const Note = ({courseTitle,courseDesc}) => {
  const [noteActive, setNoteActive] = useState(true);

  const handleNoteTab = () => {
    setNoteActive(true);
  };

  const handleDescTab = () => {
    setNoteActive(false);
  };

 

  return (
    <div className={`note-container ${inter.className}`}>
      <div className="note-content">
        <div className="notes-tabs">
          {noteActive ? (
            <>
              <button onClick={handleNoteTab} style={{borderBottom: '1px solid #3b82f6'}}>Notes</button>
              <button onClick={handleDescTab} style={{color: "grey"}}>Description</button>
            </>
          ) : (
            <>
              <button onClick={handleNoteTab} style={{color: "grey"}}>Notes</button>
              <button onClick={handleDescTab} style={{borderBottom: '1px solid #3b82f6'}}>Description</button>
            </>
          )}
        </div>
        {noteActive ? (
          <div className="notes-content">
            <NoteComponent />
          </div>
        ) : (
          <div>
            <DescComponent title={courseTitle} desc={courseDesc}/>
          </div>
        )}
>>>>>>> 911c895 (Initial Mask commit)
      </div>
    </div>
  );
};

export default Note;
