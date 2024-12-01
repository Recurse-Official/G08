"use client";

import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; // Import axios
import Button54 from "@/components/Button54"; // Assuming Button54 is a reusable button component
import { useGetUserQuery } from "@/lib/services/auth";

const Dashboard = () => {
  const [user, setUser] = useState({});
  const { data, isSuccess } = useGetUserQuery();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const router = useRouter();
  useEffect(() => {
    if (data && isSuccess) {
      setUser(data.user);
      //console.log(data.user._id); // Log directly from `data`.
    }
  }, [data, isSuccess]);
  const handleGenerateContent = async () => {
    if (!youtubeLink) {
      alert("Please enter a valid YouTube link!");
      return;
    }
    // Replace with the actual user ID
    // console.log(user._id)
    const body = {
      user_id: user._id,
      urls: [youtubeLink],
    };


    try {
      setIsLoading(true); // Set loading state
      const response = await axios.post("http://127.0.0.1:5000/process_videos", body);
      setGeneratedContent(`Success: ${JSON.stringify(response.data)}`);
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="min-h-screen bg-black text-white pt-36 flex flex-col items-center px-6">
        <h1 className="text-3xl font-bold mb-8">Generate Content from YouTube</h1>
        <div className="w-full max-w-md bg-black border border-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium mb-4">Enter YouTube Link</h2>
          <input
            type="text"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            placeholder="Enter a YouTube link"
            className="w-full h-16 px-4 py-2 bg-black text-white border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg"
          />
          <Button54
            onClick={handleGenerateContent}
            className="mt-4 w-full h-16 bg-white text-black rounded-md font-bold"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Processing..." : "Generate Content"}
          </Button54>
          {generatedContent && (
            <p className="mt-4">
              {generatedContent}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;