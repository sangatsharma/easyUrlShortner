import * as React from "react";
import Footer from "../Components/Footer";
import Header from "../Components/Header";

interface IPageNotFoundProps {}

const PageNotFound: React.FunctionComponent<IPageNotFoundProps> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <h3 className="text-4xl text-center mt-4">404 </h3>
      <h1 className="text-6xl text-center mt-4">Page not found.</h1>
      <Footer />
    </div>
  );
};

export default PageNotFound;
