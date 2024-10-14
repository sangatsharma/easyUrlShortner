import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="bg-blue-50 p-8 rounded-lg shadow-lg max-w-3xl mx-auto mt-12 text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
        Unlock the Full Potential of EasyURL!
      </h2>
      <p className="text-gray-700 mb-6">
        Access exclusive features like custom-branded URLs, advanced analytics, bulk URL shortening, 
        API access, and personalized QR codes. Elevate your link management and stay ahead with real-time insights.
      </p>
      <button
        className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-md text-lg font-semibold hover:from-blue-500 hover:to-blue-300 transition-all"
      >
        Get Started for Free
      </button>
    </section>
  );
};

export default CTASection;
