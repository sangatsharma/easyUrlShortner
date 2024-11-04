import * as React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
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

  useEffect(() => {
    if (id !== undefined) {
      getIpLocation();
    }
  }, [id]);

  useEffect(() => {
    // Wait until the location is fetched before redirecting
    if (location.city !== null) {
      const referrerSource = encodeURIComponent(
        document.referrer || window.location.hostname
      );
      const deviceType = navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      )
        ? "Mobile"
        : "Desktop";
      console.log("Device type:", deviceType);
      const locString = `${encodeURIComponent(
        location.city || "Unknown"
      )}::${encodeURIComponent(location.country || "Unknown")}`;

      // Check if the user is new or returning
      let visitorId = getUserCookie();
      if (!visitorId) {
        visitorId = generateUniqueId(); // Generate a new visitor ID
        setUserCookie(visitorId);
        console.log("New user identified with ID:", visitorId);
      } else {
        console.log("Returning user identified with ID:", visitorId);
      }

      const redirectUrl = `${
        import.meta.env.VITE_SERVER_URL
      }/api/getLongUrl/${id}/${referrerSource}/${locString}/${deviceType}/${visitorId}`;

      window.location.href = redirectUrl;
    }
  }, [location, id]);

  return <></>; // Component does not render anything
};

export default RedirectPage;
