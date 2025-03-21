"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/_context/AuthContext";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  const TEST_COURSES = [
    { name: "Machine Learning", videos: 5 },
    { name: "Probability & Statistics", videos: 5 },
    { name: "Deep Learning", videos: 5 },
    { name: "Backend Development", videos: 5 },
    { name: "Frontend Development", videos: 5 },
    { name: "DevOps", videos: 5 },
    { name: "API", videos: 5 },
    { name: "Transformers", videos: 5 },
    { name: "Artificial Intelligence", videos: 5 },
    { name: "LLMOps", videos: 5 },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedUserId = sessionStorage.getItem("user_id");
        const token = sessionStorage.getItem("access_token");
        setUserId(storedUserId);

        const fetchCourses = async () => {
          if (!storedUserId) {
            throw new Error("User ID not found");
          }

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}courses/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch courses");
          }
          const data = await response.json();
          setCourses(data);
        };

        if (storedUserId) {
          fetchCourses();
        }
      } catch (err) {
        console.error("Error in useCourses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, []); // Empty dependency array for initial mount only

  return { courses, loading, error };
}
