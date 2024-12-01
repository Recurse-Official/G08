"use client";

// import { useUser } from "@/context/userContext"; // Access user context
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

const History = () => {
//   const { user } = useUser();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      setError("User ID is missing!");
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/get_user_history/${user._id}`);
        setHistory(response.data.videos || []);
      } catch (err) {
        console.error("Error fetching history:", err);
        setError("Failed to fetch history.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user?._id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white pt-36 flex flex-col items-center px-6">
        <h1 className="text-3xl font-bold mb-8">Your Video History</h1>
        {history.length === 0 ? (
          <p>No history found.</p>
        ) : (
          <div className="w-full max-w-4xl">
            {history.map((video) => (
              <div
                key={video._id}
                className="bg-gray-800 p-4 mb-4 rounded shadow-md border border-gray-700"
              >
                <h2 className="text-lg font-bold">{video.video_title}</h2>
                <p className="text-sm">Video ID: {video.video_id}</p>
                <p className="text-sm">Notes: {JSON.stringify(video.notes_json)}</p>
                <p className="text-sm">Questions: {JSON.stringify(video.questions_json)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default History;