import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { isValidUrl } from "../utils/validUrlChecker";

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // In case you want to redirect on error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id !== undefined) {
      window.location.href = `${
        import.meta.env.VITE_SERVER_URL
      }/api/getLongUrl/${id}`;
      // getOriginalUrl(id);
    }
  }, [id]);

  // const getOriginalUrl = async (id: string) => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_SERVER_URL}/${id}`,
  //       { withCredentials: true }
  //     );
  //     console.log(response.data);
  //     if (isValidUrl(response.data.url.originalUrl)) {
  //       // Redirect to the original URL
  //       window.location.href = response.data.url.originalUrl;
  //     } else {
  //       setError("Invalid URL");
  //     }
  //   } catch (err) {
  //     console.error("Error in getting original URL:", err);
  //     setError("Failed to retrieve the original URL.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-4xl text-red-500">{error}</h1>
        <button
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  // If redirected, this won't render; it's a fallback in case of issues.
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <h1>Redirecting...</h1>
    </div>
  );
};

export default RedirectPage;
