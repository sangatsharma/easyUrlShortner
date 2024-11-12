import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import {
  generateUniqueId,
  getUserCookie,
  setUserCookie,
} from "../utils/cookieHelper.ts";

const RedirectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<{
    city: string | null;
    country: string | null;
  }>({ city: null, country: null });
  const [visitorId, setVisitorId] = useState<string | null>(null);

  const getIpLocation = async () => {
    try {
      const response = await axios.get("https://ipapi.co/json");
      const city = response.data.city || "Unknown";
      const country = response.data.country_name || "Unknown";
      console.log({ city, country });

      // Set location state
      setLocation({ city, country });
    } catch (err) {
      console.log(err);
      // Set default location if an error occurs
      setLocation({ city: "unknown", country: "unknown" });
    }
  };

  const visitorIdSetup = () => {
    // Check if the user is new or returning
    let visitorId = getUserCookie();
    if (!visitorId) {
      visitorId = generateUniqueId(); // Generate a new visitor ID
      setUserCookie(visitorId);
      setVisitorId(visitorId);
      console.log("New user identified with ID:", visitorId);
    } else {
      setVisitorId(visitorId);
      console.log("Returning user identified with ID:", visitorId);
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      getIpLocation();
    }
    if (visitorId === null) {
      visitorIdSetup();
    }
  }, [id]);

  useEffect(() => {
    console.log("Referrer", document.referrer);

    // Wait until the location is fetched before redirecting
    if (location.city !== null && visitorId) {
      const referrerSource = encodeURIComponent(
        document.referrer || window.location.hostname
      );
      // Detect device type
      const userAgent = navigator.userAgent;
      let deviceType = "Unknown";

      // Detect device type from user agent
      if (/Android/i.test(userAgent)) {
        deviceType = "Android";
      } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
        deviceType = "iOS";
      } else if (/Macintosh/i.test(userAgent)) {
        deviceType = "Mac";
      } else if (/Windows NT/i.test(userAgent)) {
        deviceType = "Windows";
      } else if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) {
        deviceType = "Linux";
      } else if (/webOS/i.test(userAgent)) {
        deviceType = "webOS";
      }
      console.log("Device type:", deviceType);
      const locString = `${encodeURIComponent(
        location.city || "Unknown"
      )}::${encodeURIComponent(location.country || "Unknown")}`;

      const redirectUrl = `${
        import.meta.env.VITE_SERVER_URL
      }/api/getLongUrl/${id}/${referrerSource}/${locString}/${deviceType}/${visitorId.toString()}`;
      console.log("Redirecting to:", redirectUrl);

      // Make the actual redirect
      window.location.href = redirectUrl;
    }
  }, [location, id, visitorId]);

  return (
    <>
      {/* Helmet for SEO optimization */}
      <Helmet>
        <title>Redirecting...</title>
        <meta name="description" content="Redirecting to your destination based on your location and device. Please wait." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://www.easyurl.me/${id}`} />
        {/* Open Graph Tags */}
        <meta property="og:title" content="Redirecting to Your Destination" />
        <meta property="og:description" content="You are being redirected based on your location and device." />
        <meta property="og:url" content={`https://www.easyurl.me/${id}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.easyurl.me/images/og-image.jpg" />
        {/* Twitter Cards */}
        <meta name="twitter:title" content="Redirecting to Your Destination" />
        <meta name="twitter:description" content="Redirecting based on your location and device. If you are not redirected, click here." />
        <meta name="twitter:image" content="https://www.easyurl.me/images/twitter-card.jpg" />
      </Helmet>

      {/* Fallback message for screen readers */}
      <div aria-live="polite" role="status" style={{ display: "none" }}>
        <p>
          Redirecting to your destination. If you are not redirected, please click{" "}
          <a href="/" aria-label="Go back to homepage">here</a>.
        </p>
      </div>
    </>
  );
};

export default RedirectPage;
