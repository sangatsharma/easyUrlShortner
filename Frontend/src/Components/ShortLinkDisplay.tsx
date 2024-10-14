import React, { useState } from 'react';

interface ShortLinkProps {
  shortLink: string;
}

const ShortLinkDisplay: React.FC<ShortLinkProps> = ({ shortLink }) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset copy status
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="mt-8 flex justify-center items-center">
      <input
        type="text"
        value={shortLink}
        readOnly
        className="w-80 px-4 py-2 border border-gray-300 rounded-l-md text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={copyToClipboard}
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-r-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        {copySuccess ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default ShortLinkDisplay;
