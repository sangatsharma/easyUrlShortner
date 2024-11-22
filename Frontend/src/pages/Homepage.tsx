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
        <script type="application/ld+json">
          {`
                {
                  "@context": "https://schema.org",
                  "@type": "WebSite",
                  "name": "EasyURL.me",
                  "url": "https://www.easyurl.me",
                  "description": "EasyURL.me is a fast and secure URL shortening service that allows users to shorten and track their links."
                }
              `}
        </script>

        {/* Title and Meta Description */}
        <title>Easy URL Shortener - Shorten Your Links Instantly</title>
        <meta
          name="description"
          content="Shorten your URLs easily with EasyURL.me. Manage links, track clicks, and streamline your sharing process."
        />
        <meta name="robots" content="index, follow" />
        <meta
          name="keywords"
          content="URL Shortener, Link Shortener, Free URL Shortener, Custom Short Links, Shorten URLs Instantly, URL Management Tool, Track Link Clicks, URL Analytics, Short Link Generator, URL Shortener for Social Media"
        />

        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="URL Shortener - Shorten Your Links Instantly"
        />
        <meta
          property="og:description"
          content="Create a short URL easily with EasyURL.me, the best URL shortener. Manage links, track clicks, and streamline your sharing process with our efficient tool."
          data-rh="true"
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
        <link rel="canonical" href="https://www.easyurl.me" />
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
