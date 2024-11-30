"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { registerSchema } from "@/validation/schemas";
import { useState } from "react";
import { useCreateUserMutation } from "@/lib/services/auth";
import { useRouter } from "next/navigation";
import Button54black from "@/components/Button54black";
import InputField from "@/components/InputField";

const initialValues = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
};

const Register = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      setServerErrorMessage("");
      setServerSuccessMessage("");

      try {
        const response = await createUser(values);

        if (response?.data?.status === "success") {
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage("");
          action.resetForm();
          setLoading(false);
          router.push("/account/login");
        } else if (response?.error?.data?.status === "failed") {
          setServerErrorMessage(response.error.data.message);
          setServerSuccessMessage("");
          setLoading(false);
        } else {
          setServerErrorMessage("An unexpected error occurred. Please try again.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setServerErrorMessage("An unexpected error occurred. Please try again.");
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-500">
      <div className="w-full max-w-md p-8 bg-white text-black rounded-none shadow-black border-4 border-black shadow-[1px_1px_0_0_white,2px_2px_0_0_white,3px_3px_0_0_white,4px_4px_0_0_white,5px_5px_0_0_white,6px_6px_0_0_white,7px_7px_0_0_white,8px_8px_0_0_white]">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            label="Name"
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
          />
          {touched.name && errors.name && (
            <div className="text-sm text-red-500 px-2">{errors.name}</div>
          )}

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

          <InputField
            label="Confirm Password"
            type="password"
            name="password_confirmation"
            value={values.password_confirmation}
            onChange={handleChange}
          />
          {touched.password_confirmation && errors.password_confirmation && (
            <div className="text-sm text-red-500 px-2">{errors.password_confirmation}</div>
          )}

          <div className="mt-4">
            <Button54black type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </Button54black>
          </div>
        </form>
        <p className="text-sm text-gray-600 p-1">
          Already a User?{" "}
          <Link
            href="/account/login"
            className="text-indigo-500 hover:text-indigo-600 transition duration-300 ease-in-out"
          >
            Login
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

export default Register;