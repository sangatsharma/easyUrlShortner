import * as React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

interface IPageNotFoundProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const PageNotFound: React.FunctionComponent<IPageNotFoundProps> = ({
  isAuthenticated,
  loading,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta
          name="description"
          content="Sorry, the page you are looking for does not exist. Please check the URL or go back to the homepage."
        />
        <Helmet>
          <script type="application/ld+json">
            {`
                {
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "name": "404 Not Found - EasyURL.me",
                  "url": "https://www.easyurl.me/404",
                  "description": "The page you are looking for doesn't exist."
                }
              `}
          </script>
        </Helmet>
      </Helmet>
      <Header isAuthenticated={isAuthenticated} loading={loading} />
      <div className="flex flex-col items-center justify-center flex-grow text-center py-12">
        <h3 className="text-4xl text-gray-600">404</h3>
        <h1 className="text-6xl text-gray-800 mt-4">Page Not Found</h1>
        <p className="text-lg text-gray-800 mt-4">
          The page you are looking for might have been moved or deleted.
        </p>
        <button
          onClick={() => navigate("/")}
          className="text-blue-500 hover:underline text-xl"
        >
          Go back to Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default PageNotFound;
