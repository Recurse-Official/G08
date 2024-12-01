"use client";

import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { useParams } from "next/navigation"; // For dynamic routing
import axios from "axios";
import Navbar from "@/components/Navbar"; // Import Navbar component
import Footer from "@/components/Footer"; // Import Footer component

const WatchPage = () => {
  const { courseId } = useParams(); // Get the courseId from the URL
  const playerRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [notes, setNotes] = useState([]);
  const [currentSection, setCurrentSection] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Notes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch course details using the courseId
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/get_course_details/${courseId}`
        );
        console.log("Course data fetched:", response.data);
        const { video_id, notes_json } = response.data;

        // Assuming video_id is the YouTube video ID
        setVideoUrl(`https://www.youtube.com/watch?v=${video_id}`);
        setNotes(notes_json.sections || []);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  // Convert timestamps (e.g., "01:02:30") to seconds
  const parseTimestamp = (timestamp) => {
    const parts = timestamp.split(":").map(Number);
    let totalSeconds = 0;

    if (parts.length === 3) {
      const [hours, mins, secs] = parts;
      totalSeconds = hours * 3600 + mins * 60 + secs;
    } else if (parts.length === 2) {
      const [mins, secs] = parts;
      totalSeconds = mins * 60 + secs;
    }
    return totalSeconds;
  };

  // Synchronize notes with the video's progress
  const handleProgress = ({ playedSeconds }) => {
    const section = notes.find(
      (note) =>
        playedSeconds >= parseTimestamp(note.start_timestamp) &&
        playedSeconds < parseTimestamp(note.end_timestamp)
    );

    if (section && section !== currentSection) {
      setCurrentSection(section);
    }
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-grow pt-24">
        {/* Left Side - Video Player */}
        <div className="w-1/2 flex flex-col items-center justify-center border-r border-gray-700 p-4">
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            controls
            width="100%"
            height="400px"
            onProgress={handleProgress} // Update notes based on the progress
          />
        </div>

        {/* Right Side - Tabs and Content */}
        <div className="w-1/2 flex flex-col bg-black p-6">
          {/* Tabs */}
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setSelectedTab("Notes")}
              className={`flex-1 py-2 text-lg font-semibold ${
                selectedTab === "Notes"
                  ? "bg-black text-white border border-2"
                  : "bg-black text-gray-400"
              } hover:bg-gray-700 hover:text-white`}
            >
              Notes
            </button>
            <button
              onClick={() => setSelectedTab("Chat")}
              className={`flex-1 py-2 text-lg font-semibold ${
                selectedTab === "Chat"
                  ? "bg-black text-white border border-2"
                  : "bg-black text-gray-400"
              } hover:bg-gray-700 hover:text-white`}
            >
              Chat
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-grow p-4">
            {selectedTab === "Notes" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Notes</h2>
                {currentSection ? (
                  currentSection.content.map((note, index) => (
                    <div key={index}>
                      {note.type === "heading" && <h4>{note.text}</h4>}
                      {note.type === "subheading" && <h5>{note.text}</h5>}
                      {note.type === "text" && <p>{note.text}</p>}
                    </div>
                  ))
                ) : (
                  <p>No notes available for this section.</p>
                )}
              </div>
            )}
            {selectedTab === "Chat" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Chat</h2>
                <p className="text-gray-400">Chat functionality coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default WatchPage;