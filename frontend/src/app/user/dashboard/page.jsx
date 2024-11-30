"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const router = useRouter();

  const courses = ["Mathematics", "Science", "History", "Art", "Computer Science"];

  const handleCourseChange = (event) => {
    const selected = event.target.value;
    setSelectedCourse(selected);

    // Navigate to /user/Math if Mathematics is selected
    if (selected === "Mathematics") {
      router.push("/user/math");
    }
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <div className="min-h-screen bg-black text-white pt-36 flex flex-col items-center px-6">
        <h1 className="text-3xl font-bold mb-8">Choose Your Course</h1>
        <div className="w-full max-w-md bg-black border border-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium mb-4">Select a Course</h2>
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full h-16 px-4 py-2 bg-black text-white border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white text-lg"
          >
            <option value="" disabled>
              Choose a course
            </option>
            {courses.map((course, index) => (
              <option
                key={index}
                value={course}
                className="bg-black text-white"
              >
                {course}
              </option>
            ))}
          </select>
          {selectedCourse && selectedCourse !== "Mathematics" && (
            <p className="mt-4">
              You selected: <span className="font-bold">{selectedCourse}</span>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;