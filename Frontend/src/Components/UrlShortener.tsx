import React, { useState } from "react";
import axios from "axios";
import ShortLinkDisplay from "./ShortLinkDisplay";



const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleShorten = async () => {
    if (!url) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        "http://localhost:5001/",
        { originalUrl: url }
      );
      console.log(response.data.url);
      setShortLink(`easyurl.me/${response.data.url.shortId}`);
    } catch (err) {
      setError("Failed to shorten the URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto mt-4">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Shorten Your URL
      </h2>
      <input
        type="text"
        placeholder="Enter your URL here"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <button
        onClick={handleShorten}
        disabled={loading}
        className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
      >
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {shortLink && <ShortLinkDisplay shortLink={shortLink} />}
    </div>
  );
};

export default UrlShortener;
