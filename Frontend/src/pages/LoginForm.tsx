import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import axios from "axios";
import { Helmet } from "react-helmet-async";

interface ILoginFormProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const LoginForm: React.FC<ILoginFormProps> = (props) => {
  if (!props.loading && props.isAuthenticated) {
    window.location.href = "/dashboard";
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
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
        if (data.success) {
          window.location.href = "/dashboard";
        } else {
          setError(data.message);
          setTimeout(() => {
            setError(null);
          }, 3000);
        }
      } catch (err) {
        setError("Failed to login. Please try again.");
        setTimeout(() => {
          setError(null);
        }, 3000);
        console.log("Failed to login. Please try again.", err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <Helmet>
        <script type="application/ld+json">
          {`
                {
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "name": "Login - EasyURL.me",
                  "url": "https://www.easyurl.me/login",
                  "description": "Login to EasyURL.me to access your account and manage your shortened links."
                }
              `}
        </script>

        <title>Login - Easy URL Shortener</title>
        <meta
          name="description"
          content="Login to your account on Easy URL Shortener to access your dashboard and manage your links."
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Login - Easy URL Shortener" />
        <meta
          property="og:description"
          content="Login to access your dashboard and manage your URLs in Easy URL Shortener."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.easyurl.me/login" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login - Easy URL Shortener" />
        <meta
          name="twitter:description"
          content="Login to manage your URLs in Easy URL Shortener."
        />
        <link rel="canonical" href="https://www.easyurl.me/login" />
      </Helmet>

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
              aria-describedby="email-error"
              aria-required="true"
            />
            {formik.touched.email && formik.errors.email ? (
              <div id="email-error" className="text-red-500 text-sm">
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
              aria-describedby="password-error"
              aria-required="true"
            />
            {formik.touched.password && formik.errors.password ? (
              <div id="password-error" className="text-red-500 text-sm">
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
            disabled={loading}
            aria-live="assertive"
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <div className="loader" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
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
    </div>
  );
};

export default LoginForm;
