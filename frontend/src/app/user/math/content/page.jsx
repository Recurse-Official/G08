"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar"; // Import Navbar component
import Footer from "@/components/Footer"; // Import Footer component
import { useRouter } from "next/navigation";

const MathPage = () => {
  const [selectedTab, setSelectedTab] = useState("Notes");
  const [videoTitle, setVideoTitle] = useState("Default Video Title");
  const router = useRouter();

  useEffect(() => {
    // Get video title from query params
    const queryParams = new URLSearchParams(window.location.search);
    const title = queryParams.get("title");
    if (title) {
      setVideoTitle(title);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-grow pt-24">
        {/* Left Side - Video Placeholder */}
        <div className="w-1/2 flex flex-col items-center justify-center border-r border-gray-700 p-4">
          <div className="w-full aspect-[16/9] bg-gray-800 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-lg">{videoTitle}</p>
          </div>
        </div>

        {/* Right Side - Full Box */}
        <div className="w-1/2 flex flex-col bg-black p-6">
          {/* Card Header with Tabs */}
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

          {/* Card Content */}
          <div className="flex-grow p-4">
            {selectedTab === "Notes" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Notes</h2>
                <p className="text-gray-400">Here are your notes...</p>
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

export default MathPage;