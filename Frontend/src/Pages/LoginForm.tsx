import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import ResendOTPButton from "../Components/ResendOTPButton";

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formtype, setFormType] = useState<"login" | "otp">("login");
  const [error, setError] = useState<string | null>(null);
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
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("Required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values) => {
      // Add your login logic here
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/user/auth/login`,
          {
            email: values.email as string,
            password: values.password as string,
          },
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        console.log(data);
        if (!data.success) {
          if (data.message === "Email is not verified.") {
            setFormType("otp");
          } else {
            setError(data.message);
            setTimeout(() => {
              setError(null);
            }, 3000);
          }
        } else {
          // Redirects to dashboard on successful login from backend
          window.location.href = "/dashboard";
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
      {formtype === "login" ? (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
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
            <div className="flex justify-between">
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
            >
             {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          <div className="mt-4 text-center">
            <p className="text-sm">
              Don't have an account?
              <Link to="/signup" className="text-blue-500 hover:underline">
                {" "}
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <div>
            <p className="text-center mb-4 font-bold">Email Verification</p>
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
           {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
