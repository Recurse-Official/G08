"use client";

import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/validation/schemas";
import { useResetPasswordMutation } from "@/lib/services/auth";
import { useState } from "react";
import Button54 from "@/components/Button54black";
import InputField from "@/components/InputField"; // Reuse InputField component

const initialValues = {
  password: "",
  password_confirmation: "",
};

const ResetPasswordConfirm = () => {
  const [serverErrorMessage, setServerErrorMessage] = useState("");
  const [serverSuccessMessage, setServerSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id, token } = useParams();
  const [resetPassword] = useResetPasswordMutation();

  const { values, errors, handleChange, handleSubmit, touched } = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const data = { ...values, id, token };
        const response = await resetPassword(data);
        if (response.data && response.data.status === "success") {
          setServerSuccessMessage(response.data.message);
          setServerErrorMessage("");
          action.resetForm();
          setLoading(false);
          router.push("/account/login");
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
            label="New Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
          />
          {touched.password && errors.password && (
            <div className="text-sm text-red-500 px-2">{errors.password}</div>
          )}

          <InputField
            label="Confirm New Password"
            type="password"
            name="password_confirmation"
            value={values.password_confirmation}
            onChange={handleChange}
          />
          {touched.password_confirmation && errors.password_confirmation && (
            <div className="text-sm text-red-500 px-2">
              {errors.password_confirmation}
            </div>
          )}

          <div className="mt-4">
            <Button54 type="submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button54>
          </div>
        </form>
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

export default ResetPasswordConfirm;