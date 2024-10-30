import * as React from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

interface IPageNotFoundProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const PageNotFound: React.FunctionComponent<IPageNotFoundProps> = ({
  isAuthenticated,
  loading,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header isAuthenticated={isAuthenticated} loading={loading} />
      <h3 className="text-4xl text-center mt-4">404 </h3>
      <h1 className="text-6xl text-center mt-4">Page not found.</h1>
      <Footer />
    </div>
  );
};

export default PageNotFound;
