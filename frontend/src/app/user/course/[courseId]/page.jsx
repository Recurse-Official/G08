"use client";

import { useParams, useRouter } from "next/navigation"; // Import useParams and useRouter
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Button54 from "@/components/Button54"; // Import Button54

const CoursePage = () => {
  const { courseId } = useParams(); // Get the courseId from the URL
  const router = useRouter(); // Initialize router for navigation
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (courseId) {
      const fetchCourseDetails = async () => {
        try {
          // Send Axios request to Flask route
          const response = await axios.get(
            `http://127.0.0.1:5000/get_course_details/${courseId}`
          );
          console.log("Course data fetched:", response.data);
          setCourse(response.data); // Set course data from the response
        } catch (err) {
          console.error("Error fetching course details:", err);
          setError("Failed to load course details.");
        } finally {
          setLoading(false);
        }
      };

      fetchCourseDetails();
    }
  }, [courseId]);

  const handleNext = () => {
    // Navigate to the watch/[courseId] route
    router.push(`/user/watch/${courseId}`);
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
      <div className="min-h-screen bg-black text-white pt-36 px-6">
        <h1 className="text-3xl font-bold mb-8">{course.video_title}</h1>
        {course.notes_json?.sections?.length > 0 ? (
          <div>
            {course.notes_json.sections.map((section) => (
              <div key={section.section_number} className="mb-6">
                {section.content.map((item, index) => (
                  <div key={index}>
                    {item.type === "heading" && (
                      <h2 className="text-xl font-bold">{item.text}</h2>
                    )}
                    {item.type === "subheading" && (
                      <h3 className="text-lg font-semibold">{item.text}</h3>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <p>No notes available for this course.</p>
        )}

        {/* Next Button */}
        <div className="flex justify-center mt-10">
          <Button54
            onClick={handleNext}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 shadow-lg"
          >
            Next
          </Button54>
        </div>
      </div>
    </>
  );
};

export default CoursePage;