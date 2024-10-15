import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // In case you want to redirect on error
 

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

 
  // If redirected, this won't render; it's a fallback in case of issues.
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <h1>Redirecting...</h1>
    </div>
  );
};

export default RedirectPage;
