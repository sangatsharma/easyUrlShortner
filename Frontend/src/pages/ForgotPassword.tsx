import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ResendOTPButton from "../components/ResendOTPButton";
import { Helmet } from "react-helmet-async";

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState<string | null>("");
  const [isError, setIsError] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState<string>("");

  const handleOtpVerification = async () => {
    if (!otp) {
      setIsError(true);
      setMessage("Please enter OTP");
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/verifyOtp`,
        {
          email: emailFormik.values.email as string,
          otp: otp as string,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.success) {
        setIsError(false);
        setMessage(data.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
        setStep("reset");
      } else {
        setIsError(true);
        setMessage(data.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      }
    } catch (err) {
      console.log("Failed to login. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  // Formik setup for email request
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/user/find`,
          {
            email: values.email as string,
          },
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        if (data.success) {
          setIsError(false);
          setMessage("OTP sent to your email!");
          setStep("verify"); // Move to the OTP verification step
        } else {
          setIsError(true);
          setMessage(data.message);
          setTimeout(() => {
            setMessage(null);
          }, 3000);
        }
      } catch (err: any) {
        setIsError(true);
        setMessage(`Failed to send OTP. Please try again: ${err.message}`);
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } finally {
        setLoading(false);
      }
    },
  });

  // Handle password reset
  const handlePasswordReset = async () => {
    if (newPassword.length < 6) {
      setIsError(true);
      setMessage("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword || !newPassword || !confirmPassword) {
      setIsError(true);
      setMessage("Passwords don't match!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/auth/reset-password`,
        {
          email: emailFormik.values.email as string,
          password: newPassword as string,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.success) {
        setIsError(false);
        setMessage(data.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
      } else {
        setIsError(true);
        setMessage(data.message);
        setTimeout(() => {
          setMessage(null);
        }, 3000);
        return;
      }
    } catch (err) {
      setIsError(true);
      setMessage("Failed to reset password. Please try again.");
      console.log("Failed to reset password. Please try again.", err);
    } finally {
      setLoading(false);
    }
    setIsError(false);
    setMessage("Password has been reset successfully!");
    // Reset form and states
    setNewPassword("");
    setConfirmPassword("");
    setOtp("");
    emailFormik.resetForm();

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage("Redirecting to home page...");
      window.location.href = "/";
    }, 1000);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <Helmet>
        <title>Forgot Password - Easy URL Shortener</title>
        <meta
          name="description"
          content="Reset your password for Easy URL Shortener. Follow the steps to recover your account."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Forgot Password - Easy URL Shortener" />
        <meta
          property="og:description"
          content="Follow the simple steps to reset your password and regain access to your account on Easy URL Shortener."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.easyurl.me/forgot-password" />
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:title" content="Forgot Password - Easy URL Shortener" />
        <meta
          name="twitter:description"
          content="Need to reset your password? Follow the steps to recover your account with Easy URL Shortener."
        />
        <link rel="canonical" href="https://www.easyurl.me/forgot-password" />
      </Helmet>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {step === "request"
            ? "Forgot Password"
            : step === "verify"
            ? "Verify OTP"
            : "Reset Password"}
        </h1>

        {step === "request" && (
          <form onSubmit={emailFormik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-lg">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...emailFormik.getFieldProps("email")}
                className={`border p-3 rounded w-full ${
                  emailFormik.touched.email && emailFormik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                placeholder="Email"
                aria-describedby="email-error"
                aria-required="true"
              />
              {emailFormik.touched.email && emailFormik.errors.email ? (
                <div id="email-error" className="text-red-500 text-sm">
                  {emailFormik.errors.email}
                </div>
              ) : null}
            </div>
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
              aria-live="assertive"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block mb-2 text-lg">
                Enter OTP sent to your email
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-3 rounded w-full"
                placeholder="OTP"
                aria-describedby="otp-error"
              />
            </div>
            <ResendOTPButton
              setError={setMessage}
              userEmail={emailFormik.values.email}
              otpType="reset"
            />
            <button
              disabled={loading}
              onClick={handleOtpVerification}
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
              aria-live="assertive"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}

        {step === "reset" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block mb-2 text-lg">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-3 rounded w-full"
                placeholder="New Password"
                aria-describedby="new-password-error"
                aria-required="true"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-lg">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-3 rounded w-full"
                placeholder="Confirm Password"
                aria-describedby="confirm-password-error"
                aria-required="true"
              />
            </div>
            <button
              onClick={handlePasswordReset}
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
              aria-live="assertive"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}

        {message && (
          <div
            className={`mt-4 text-center ${
              isError ? "text-red-500" : "text-green-500"
            }`}
            aria-live="assertive"
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
