import * as React from "react";
import Header from "./Components/Header";
import UrlShortener from "./Components/UrlShortener";
import Footer from "./Components/Footer";
import FeaturesSection from "./Components/FeaturesSection";
import CTASection from "./Components/CTASection";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow">
        <UrlShortener />
        <CTASection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
