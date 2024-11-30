"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button54 from "@/components/Button54";
import { useRouter } from "next/navigation";

const ScrollablePage = () => {
  const router = useRouter();

  const handleNext = () => {
    router.push("/user/math/content");
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center pt-24 px-6">
        {/* Heading and Next Button */}
        <div className="flex w-full max-w-6xl items-center justify-between mb-8">
          <h2 className="text-4xl font-bold text-left">What's in this video</h2>
          <Button54 onClick={handleNext}>Next</Button54>
        </div>

        {/* Card */}
        <div className="w-full max-w-6xl bg-black border border-white text-white p-10 rounded-lg shadow-lg h-[70vh] overflow-y-auto mb-16">
          {/* Section 1 */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Introduction</h3>
            <p className="text-gray-300">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
              non erat mi. Fusce at consequat arcu. Mauris vulputate, justo vel
              iaculis elementum, velit est scelerisque risus, eget viverra massa
              dolor non nulla.
            </p>
          </div>

          {/* Section 2 */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Features</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>High-quality content display in a structured layout.</li>
              <li>Supports vertical scrolling for extensive information.</li>
              <li>Responsive design ensuring readability on all devices.</li>
              <li>Monochromatic theme for modern aesthetics.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Details</h3>
            <p className="text-gray-300 mb-4">
              Donec malesuada feugiat nisl, sit amet tempor arcu tempor nec.
              Integer vitae dui at nunc placerat ultricies quis a nulla. Aliquam
              erat volutpat.
            </p>
            <p className="text-gray-300">
              Praesent vel dapibus justo. Etiam varius lacus ac ligula vehicula,
              et tincidunt erat viverra. Nunc pellentesque eget nunc sit amet
              facilisis.
            </p>
          </div>

          {/* Section 4 */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Conclusion</h3>
            <p className="text-gray-300">
              In conclusion, this card provides a scalable solution for
              showcasing detailed content in a visually appealing manner. By
              maintaining a clean layout and incorporating a responsive design,
              it ensures optimal readability and user experience.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ScrollablePage;