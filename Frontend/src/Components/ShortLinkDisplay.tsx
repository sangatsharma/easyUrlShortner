import React, { useState, useCallback } from 'react';

// Props Interface
interface ShortLinkProps {
  shortLink: string;
}

// React.memo to prevent unnecessary re-renders
const ShortLinkDisplay: React.FC<ShortLinkProps> = React.memo(({ shortLink }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  // Using useCallback to memoize the function
  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2s
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [shortLink]);

  return (
    <div className="mt-8 flex justify-center items-center">
      {/* Hidden meta tag for SEO */}
      {shortLink && (
        <meta name="description" content={`Shortened link: ${shortLink}`} />
      )}

      {/* Accessible label for the input */}
      <label htmlFor="shortLinkInput" className="sr-only">
        Shortened Link
      </label>

      <input
        id="shortLinkInput"
        type="text"
        value={shortLink}
        readOnly
        aria-label="Shortened link input"
        className="w-80 px-4 py-2 border border-gray-300 rounded-l-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={copyToClipboard}
        aria-label="Copy shortened link"
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        {copySuccess ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
});

export default ShortLinkDisplay;
