"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Button54 from "@/components/Button54";
import Button54Red from "@/components/Button54Red";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const authCookie = Cookies.get("is_auth");
    setIsAuth(authCookie);
  });

  const handleLogout = () => {
    // Clear authentication cookie
    Cookies.remove("is_auth");

    // Redirect to the login page
    router.push("/account/login");

    console.log("User logged out successfully");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black border-b border-white p-4 z-50">
      <div className="flex items-center justify-between">
        {/* Left Side - Empty for spacing */}
        <div></div>

        {/* Center - Home */}
        <div className="flex-grow text-center">
          <Link href="/" className="text-white text-lg hover:underline">
            Home
          </Link>
        </div>

        {/* Right Side - Buttons */}
        <div className="flex space-x-4">
          {isAuth ? (
            <>
              <Link href="/user/dashboard">
                <Button54>Dashboard</Button54>
              </Link>
              <Link href="/user/profile">
                <Button54>Profile</Button54>
              </Link>
              <Link href="/user/history">
                <Button54>My Courses</Button54>
              </Link>
              <Button54Red
                onClick={handleLogout}
              >
                Logout
              </Button54Red>
            </>
          ) : (
            <>
              <Link href="/account/login">
                <Button54>Login</Button54>
              </Link>
              <Link href="/account/register">
                <Button54>Sign Up</Button54>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;