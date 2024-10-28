// src/components/Signup.tsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import ResendOTPButton from "../components/ResendOTPButton";

const SignupForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formType, setFormType] = useState<"signup" | "otp">("signup");
  const [otp, setOtp] = useState<string>("");

  const handleOtpVerification = async () => {
    if (!otp) {
      setError("Please enter OTP");
      setTimeout(() => {
        setError(null);
      }, 3000);
      return;
    }
    try {
      setLoading(true);
      console.log(formik.values.email, otp);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/verify`,
        {
          email: formik.values.email as string,
          otp: otp as string,
          password: formik.values.password as string,
          name: formik.values.name as string,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
      if (data.success) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.log("Failed to login. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required")
        .min(2, "Name must be at least 2 characters"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("Required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/user/signup`,
          {
            email: values.email as string,
          },
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        console.log(data);
        if (data.success) {
          setError(data.message);
          setFormType("otp");
          setTimeout(() => {
            setError(null);
          }, 3000);
        } else {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      } catch (err) {
        console.log("Failed to login. Please try again.", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      {formType === "signup" ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-lg">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...formik.getFieldProps("name")}
                className={`border p-3 rounded w-full ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Name"
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-500 text-sm">{formik.errors.name}</div>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-lg">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...formik.getFieldProps("email")}
                className={`border p-3 rounded w-full ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-lg">
                Password
              </label>
              <input
                id="password"
                type="password"
                {...formik.getFieldProps("password")}
                className={`border p-3 rounded w-full ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-lg">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...formik.getFieldProps("confirmPassword")}
                className={`border p-3 rounded w-full ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Confirm Password"
              />
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?
              <Link to="/login" className="text-blue-500 hover:underline">
                {" "}
                Log In
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <div>
            <label htmlFor="otp" className="block mb-2 text-lg">
              Enter OTP sent to your email
            </label>
            <input
              required
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-3 rounded w-full"
              placeholder="OTP"
            />
          </div>
          <ResendOTPButton
            setError={setError}
            userEmail={formik.values.email as string}
          />
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <button
            onClick={handleOtpVerification}
            className="bg-blue-500 mt-4 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
          >
            {loading ? "Verifying OTP..." : "Verify OTP"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
