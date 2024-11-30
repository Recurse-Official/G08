"use client";

import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation schema
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLoginUserMutation } from "@/lib/services/auth";
import Button54 from "@/components/Button54black";
import InputField from "@/components/InputField";

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const response = await loginUser(values);
        if (response.data && response.data.status === "success") {
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage("");
          action.resetForm();
          setLoading(false);
          router.push("/user/dashboard"); // Redirect to dashboard
        }
        if (response.error && response.error.data.status === "failed") {
          setServerErrorMessage(response.error.data.message);
          setServerSuccessMessage("");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during login:", error);
        setServerErrorMessage("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-500">
      <div className="w-full max-w-md p-8 bg-white text-black rounded-none shadow-black border-4 border-black shadow-[1px_1px_0_0_white,2px_2px_0_0_white,3px_3px_0_0_white,4px_4px_0_0_white,5px_5px_0_0_white,6px_6px_0_0_white,7px_7px_0_0_white,8px_8px_0_0_white]">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
          {touched.email && errors.email && (
            <div className="text-sm text-red-500 px-2">{errors.email}</div>
          )}
          <InputField
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          {touched.password && errors.password && (
            <div className="text-sm text-red-500 px-2">{errors.password}</div>
          )}
          <p className="text-sm text-gray-600 p-1">
            <Link
              href="/account/reset-password-link"
              className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
            >
              Forgot Password?
            </Link>
          </p>
          <div className="mt-4">
            <Button54 type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button54>
          </div>
        </form>
        <p className="text-sm text-gray-600 p-1">
          Not a User?{" "}
          <Link
            href="/account/register"
            className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
          >
            Create an account
          </Link>
        </p>
        {serverSuccessMessage && (
          <div className="text-sm text-green-500 font-semibold px-2 text-center">
            {serverSuccessMessage}
          </div>
        )}
        {serverErrorMessage && (
          <div className="text-sm text-red-500 font-semibold px-2 text-center">
            {serverErrorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;