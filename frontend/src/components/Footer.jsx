"use client";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 border-t border-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Beyoncé. All rights reserved.</p>
          <div className="flex space-x-4 mt-3">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-200 transition duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-200 transition duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-200 transition duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;