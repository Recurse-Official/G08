"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";


const Home = () => {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const text = "Coursify";

  useEffect(() => {
    if (visibleLetters < text.length) {
      const timer = setTimeout(() => {
        setVisibleLetters(visibleLetters + 1);
      }, 100); // Faster delay between each letter
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
    }
  }, [visibleLetters]);

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen bg-black">
        <h1
          className={`text-[12rem] font-extrabold transition-all duration-1000 ease-in-out ${
            isComplete ? "text-red-500" : "text-white"
          }`}
          style={{
            opacity: isComplete ? 1 : 0.7,
            transition: "color 0.5s ease-in-out, opacity 1s ease-in-out",
          }}
        >
          {text.slice(0, visibleLetters)}
        </h1>
        
      </div>
      <Footer />
    </>
  );
};

export default Home;