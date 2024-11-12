import * as React from "react";
import { Helmet } from "react-helmet-async";
import UrlShortener from "../components/UrlShortener";
import CTASection from "../components/CTASection";
import FeaturesSection from "../components/FeaturesSection";

interface IHomepageProps {}

const Homepage: React.FunctionComponent<IHomepageProps> = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-2">
      <Helmet>
        {/* Title and Meta Description */}
        <title>Easy URL Shortener - Shorten Your Links Instantly</title>
        <meta
          name="description"
          content="Shorten your URLs easily with EasyURL.me. Manage links, track clicks, and streamline your sharing process."
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Easy URL Shortener" />
        <meta
          property="og:description"
          content="Manage your links, shorten URLs easily, and track performance at EasyURL.me."
        />
        <meta
          property="og:image"
          content="https://www.easyurl.me/assets/og-image.png"
        />
        <meta property="og:url" content="https://www.easyurl.me" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Easy URL Shortener" />
        <meta
          name="twitter:description"
          content="Shorten your links in seconds and track clicks easily with EasyURL.me."
        />
        <meta
          name="twitter:image"
          content="https://www.easyurl.me/assets/twitter-image.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.easyurl.me/" />
      </Helmet>

      <main className="flex-grow w-full ">
        <UrlShortener />
        <CTASection />
        <FeaturesSection />
      </main>
    </div>
  );
};

export default Homepage;
