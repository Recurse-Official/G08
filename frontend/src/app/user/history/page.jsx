"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useGetUserQuery } from "@/lib/services/auth";
import Button54 from "@/components/Button54";

const History = () => {
  const { data, isSuccess } = useGetUserQuery(); // Fetch user data
  const [user, setUser] = useState(null); // State to store user
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Set the user when data is successfully fetched
    if (data && isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    // Fetch history only if user ID is available
    if (user?._id) {
      const fetchHistory = async () => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/get_user_history/${user._id}`
          );
          setHistory(response.data.videos || []);
        } catch (err) {
          console.error("Error fetching history:", err);
          setError("Failed to fetch history.");
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [user]);

  const handleViewCourse = (courseId) => {
    // Navigate to course details page
    router.push(`/user/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-36 flex flex-col items-center px-6">
        <h1 className="text-3xl font-bold mb-8">Your Video History</h1>
        {history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((video) => (
              <Button54
                key={video._id}
                onClick={() => handleViewCourse(video._id)}
                className="p-6 w-full text-left bg-gray-800 rounded-lg shadow-md border border-gray-700"
              >
                <h2 className="text-lg font-bold">{video.video_title}</h2>
                <p className="text-sm text-gray-400">
                  {video.description
                    ? video.description.slice(0, 100)
                    : "No description available"}
                  ...
                </p>
              </Button54>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;