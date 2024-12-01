"use client";

import { useGetUserQuery } from "@/lib/services/auth";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Button54 from "@/components/Button54";
import Button54Red from "@/components/Button54Red"; // Assuming you have Button54 for buttons
import Cookies from "js-cookie"; // Import Cookies to manage authentication cookie
import { useRouter } from "next/navigation";

const Profile = () => {
  const [user, setUser] = useState({});
  const { data, isSuccess } = useGetUserQuery();
  const router = useRouter();

  useEffect(() => {
    if (data && isSuccess) {
      setUser(data.user);
    }
  }, [data, isSuccess]);

  const handleResetPassword = () => {
    // Redirect to the Reset Password page
    router.push("/account/reset-password-link");

    console.log("Redirecting to Reset Password page");
  };

  const handleLogout = () => {
    // Clear authentication cookie
    Cookies.remove("is_auth");

    // Redirect to the login page
    router.push("/account/login");

    console.log("User logged out successfully");
  };

  return (
    <>
      <Navbar /> {/* Include Navbar */}
      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-5">
        <div className="w-full max-w-md p-8 bg-black text-white rounded-none   shadow-white border-4 border-white shadow-[1px_1px_0_0_black,2px_2px_0_0_black,3px_3px_0_0_black,4px_4px_0_0_black,5px_5px_0_0_black,6px_6px_0_0_black,7px_7px_0_0_black,8px_8px_0_0_black]">
          <h2 className="text-2xl font-bold mb-6 text-center">User Profile</h2>
          <div className="mb-4">
            <label className="block font-medium mb-2">Name: {user._id}</label>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Name: {user.name}</label>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">Email: {user.email}</label>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-2">
              Verified: {user.is_verified ? "Yes" : "No"}
            </label>
          </div>
          <div className="flex justify-between mt-6">
            <Button54 onClick={handleResetPassword}>Reset Password</Button54>
            <Button54Red onClick={handleLogout}>Logout</Button54Red>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;