import React, { useState, useCallback } from "react";
import axios from "axios";
import ShortLinkDisplay from "./ShortLinkDisplay";
import { isValidUrl } from "../utils/validUrlChecker.ts";

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [shortLink, setShortLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce input changes for better performance
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value.trim());
    },
    []
  );

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload on form submission
    const formattedUrl = url.includes("://") ? url : `http://${url}`;
    // Encode the URL to handle spaces and special characters
 
    if (!isValidUrl(formattedUrl)) {
      setError("Please enter a valid URL.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/shortUrl`,
        { originalUrl: url }
      );
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

      <form
        onSubmit={handleShorten}
        className="space-y-4"
        aria-labelledby="form-title"
      >
        <label htmlFor="url-input" className="block text-sm font-medium">
          Enter your full URL:
        </label>
        <input
          type="text"
          id="url-input"
          placeholder="https://example.com"
          value={url}
          onChange={handleUrlChange}
          className="w-full p-2 border rounded"
          aria-invalid={!!error}
          aria-describedby={error ? "error-message" : undefined}
        />

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="bg-primary text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>
      </form>

      {error && (
        <p id="error-message" className="text-red-500 mt-4">
          {error}
        </p>
      )}
      {shortLink && <ShortLinkDisplay shortLink={shortLink} />}
    </div>
  );
};

export default UrlShortener;
