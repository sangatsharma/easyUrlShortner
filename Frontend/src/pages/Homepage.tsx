import * as React from "react";
import UrlShortener from "../components/UrlShortener";
import CTASection from "../components/CTASection";
import FeaturesSection from "../components/FeaturesSection";

interface IHomepageProps {}

const Homepage: React.FunctionComponent<IHomepageProps> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-2">
      <main className="flex-grow w-full ">
        <UrlShortener  />
        <CTASection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Homepage;
