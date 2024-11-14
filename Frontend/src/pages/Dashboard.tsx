import * as React from "react";
import { Helmet } from "react-helmet-async";
import UrlShortener from "../components/UrlShortener";
import UrlTable from "../components/URLtable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchLinks } from "../store/linkSlice";

const Dashboard: React.FunctionComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.links);

  React.useEffect(() => {
    dispatch(fetchLinks());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-2">
      <Helmet>
        {/* Title and Meta Description */}
        <title>Dashboard - Manage Your Shortened Links</title>
        <meta
          name="description"
          content="View and manage your shortened links, track their performance, and customize them easily with EasyURL.me."
        
        />
        <meta name="robots" content="index, follow" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Dashboard - Easy URL Shortener" />
        <meta
          property="og:description"
          content="View and manage your shortened links, track their performance, and customize them easily with EasyURL.me."
        />
        <meta
          property="og:image"
          content="https://www.easyurl.me/assets/og-image.png"
        />
        <meta property="og:url" content="https://www.easyurl.me/dashboard" />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dashboard - Easy URL Shortener" />
        <meta
          name="twitter:description"
          content="Manage and track your shortened URLs on your dashboard at EasyURL.me."
        />
        <meta
          name="twitter:image"
          content="https://www.easyurl.me/assets/twitter-image.png"
        />

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.easyurl.me/dashboard" />

        <script type="application/ld+json">
          {`
                {
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  "name": "Dashboard - EasyURL.me",
                  "url": "https://www.easyurl.me/dashboard",
                  "description": "Your personal dashboard to manage and track your shortened URLs on EasyURL.me."
                }
              `}
        </script>
      </Helmet>

      <main className="flex-grow w-full ">
        <UrlShortener />
        {loading ? (
          <p className="text-center" role="status" aria-live="polite">
            Loading links...
          </p>
        ) : (
          <UrlTable />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
