"use client";
import { useState, useRef } from "react";
import styles from "./index.module.css";
import { FaUpload, FaTimes } from "react-icons/fa";

const UploadModal = ({ onClose, onUpload, courseId }) => {
  const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const getSignedUrl = async (fileName) => {
    try {
      const token = sessionStorage.getItem("access_token");

      // Create FormData object
      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("title", title);
      // formData.append("description", description);
      formData.append("file_name", fileName);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}videos/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get signed URL");
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting signed URL:", error);
      throw error;
    }
  };

  const uploadToSignedUrl = async (signedUrl, file) => {
    try {
      const response = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
        mode: "cors", // Add CORS mode
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setUploadProgress(Math.round(progress));
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      return true;
    } catch (error) {
      console.error("Error uploading to signed URL:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError("Please fill in all fields");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Get signed URL
      const { signed_url, video_id, storage_path } = await getSignedUrl(
        file.name
      );

      // Upload to signed URL
      await uploadToSignedUrl(signed_url, file);

      // Create video record
      const token = sessionStorage.getItem("access_token");

      // Create base URL first
      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}videos/${video_id}/finalize`;

      // Encode the storage path properly
      // This ensures the GCS path (gs://) and special characters are preserved correctly
      const encodedStoragePath = encodeURIComponent(storage_path);

      // Construct URL with properly encoded parameter
      const url = `${baseUrl}?storage_path=${encodedStoragePath}`;

      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storage_path,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create video record");
      }

      const videoData = await response.json();
      onUpload(videoData);
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Add file validation here
      if (selectedFile.size > 500 * 1024 * 1024) {
        // 500MB limit
        setError("File size must be less than 500MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Upload New Lecture</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Lecture Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lecture title"
              required
            />
            {/* <label htmlFor="description">Lecture Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter lecture description"
              required
            /> */}
          </div>

          <div className={styles.formGroup}>
            <label>Upload Video</label>
            <div
              className={styles.uploadArea}
              onClick={() => fileInputRef.current.click()}
            >
              {file ? (
                <div className={styles.fileInfo}>
                  <span>{file.name}</span>
                  <small>{(file.size / (1024 * 1024)).toFixed(2)} MB</small>
                </div>
              ) : (
                <div className={styles.uploadPrompt}>
                  <FaUpload size={24} />
                  <p>Click to browse or drag video file here</p>
                  <small>MP4, WebM or MOV. Max 500MB</small>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="video/*"
                className={styles.fileInput}
              />
            </div>
          </div>

          {uploading && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${uploadProgress}%` }}
              />
              <span>{uploadProgress}%</span>
            </div>
          )}

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={uploading || !title || !file}
            >
              {uploading ? `Uploading... ${uploadProgress}%` : "Upload Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
