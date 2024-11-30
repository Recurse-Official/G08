"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { resetPasswordLinkSchema } from "@/validation/schemas";
import { useResetPasswordLinkMutation } from "@/lib/services/auth";
import { useState } from "react";
import Button54 from "@/components/Button54black";
import InputField from "@/components/InputField"; // Reuse InputField component

const initialValues = {
  email: "",
};

const ResetPasswordLink = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetPasswordLink] = useResetPasswordLinkMutation();

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema: resetPasswordLinkSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const response = await resetPasswordLink(values);
        if (response.data && response.data.status === "success") {
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage("");
          action.resetForm();
          setLoading(false);
        } else if (response.error && response.error.data.status === "failed") {
          setServerErrorMessage(response.error.data.message);
          setServerSuccessMessage("");
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen bg-gray-500">
      <div className="w-full max-w-md p-8 bg-white text-black rounded-none shadow-black border-4 border-black shadow-[1px_1px_0_0_white,2px_2px_0_0_white,3px_3px_0_0_white,4px_4px_0_0_white,5px_5px_0_0_white,6px_6px_0_0_white,7px_7px_0_0_white,8px_8px_0_0_white]">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
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

          <div className="mt-4">
            <Button54 type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Sending email..." : "Send"}
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

export default ResetPasswordLink;