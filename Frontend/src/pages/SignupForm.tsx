// src/components/Signup.tsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import ResendOTPButton from "../components/ResendOTPButton";
import { Helmet } from "react-helmet-async";

interface ISignupFormProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const SignupForm: React.FC<ISignupFormProps> = (props) => {
  if (!props.loading && props.isAuthenticated) {
    window.location.href = "/dashboard";
  }
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
      if (data.success) {
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      console.log("Failed to Signup. Please try again.", err);
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
          { email: values.email as string },
          { withCredentials: true }
        );
        const data = response.data;
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
      <Helmet>
        <title>Sign Up - EasyURL</title>
        <meta
          name="description"
          content="Create an account on EasyURL.me to shorten and track your links."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Sign Up - Easy URL Shortener" />
        <meta
          property="og:description"
          content="Create an account on EasyURL.me to shorten and track your links."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.easyurl.me/signup" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login - Easy URL Shortener" />
        <meta
          name="twitter:description"
          content="Login to manage your URLs in Easy URL Shortener."
        />
        <link rel="canonical" href="/signup" />

        <script type="application/ld+json">
          {`
                {
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "name": "Signup - EasyURL.me",
                  "url": "https://www.easyurl.me/signup",
                  "description": "Create an account on EasyURL.me to shorten and track your links."
                }
              `}
        </script>
      </Helmet>

      {formType === "signup" ? (
        <div
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
          role="form"
          aria-labelledby="signup-form"
        >
          <h1 id="signup-form" className="text-2xl font-bold mb-6 text-center">
            Sign Up
          </h1>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-lg">
                Name
              </label>
              <input
                id="name"
                type="text"
                aria-required="true"
                aria-describedby="name-error"
                {...formik.getFieldProps("name")}
                className={`border p-3 rounded w-full ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Name"
              />
              {formik.touched.name && formik.errors.name && (
                <div id="name-error" className="text-red-500 text-sm">
                  {formik.errors.name}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-lg">
                Email
              </label>
              <input
                id="email"
                type="email"
                aria-required="true"
                aria-describedby="email-error"
                {...formik.getFieldProps("email")}
                className={`border p-3 rounded w-full ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Email"
              />
              {formik.touched.email && formik.errors.email && (
                <div id="email-error" className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-lg">
                Password
              </label>
              <input
                id="password"
                type="password"
                aria-required="true"
                aria-describedby="password-error"
                {...formik.getFieldProps("password")}
                className={`border p-3 rounded w-full ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Password"
              />
              {formik.touched.password && formik.errors.password && (
                <div id="password-error" className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-lg">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                aria-required="true"
                aria-describedby="confirm-password-error"
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
                formik.errors.confirmPassword && (
                  <div
                    id="confirm-password-error"
                    className="text-red-500 text-sm"
                  >
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>

            {error && (
              <p className="text-red-500 mt-4" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
              aria-busy={loading}
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
        <div
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
          role="form"
          aria-labelledby="otp-form"
        >
          <h1 id="otp-form" className="text-xl mb-4">
            OTP Verification
          </h1>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-3 rounded w-full"
            aria-required="true"
            placeholder="Enter OTP"
          />
          <ResendOTPButton
            setError={setError}
            userEmail={formik.values.email as string}
            otpType="verify"
          />
          {error && (
            <p className="text-red-500 mt-4" role="alert">
              {error}
            </p>
          )}
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
