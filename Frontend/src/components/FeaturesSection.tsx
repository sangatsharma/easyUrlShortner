import React from "react";
import {
  FaThumbsUp,
  FaLink,
  FaShieldAlt,
  FaChartBar,
  FaCheckCircle,
  FaMobileAlt,
} from "react-icons/fa";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <FaThumbsUp className="text-4xl text-primary" />,
      title: "User-Friendly",
      description:
        "Easily shorten URLs with a simple, intuitive interface on EasyURL.",
    },
    {
      icon: <FaLink className="text-4xl text-primary" />,
      title: "Efficient Shortening",
      description:
        "Create short links quickly, regardless of the original URL’s length.",
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary" />,
      title: "Secure",
      description:
        "All URLs are encrypted with HTTPS, ensuring secure redirection.",
    },
    {
      icon: <FaChartBar className="text-4xl text-primary" />,
      title: "Track Performance",
      description:
        "Monitor your link’s performance with real-time click statistics.",
    },
    {
      icon: <FaCheckCircle className="text-4xl text-primary" />,
      title: "Reliable",
      description:
        "We ensure uninterrupted service with high uptime and performance.",
    },
    {
      icon: <FaMobileAlt className="text-4xl text-primary" />,
      title: "Mobile Friendly",
      description:
        "Access and manage your short links from any smartphone or device.",
    },
  ];

  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Use EasyURL.me?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white p-6 rounded-lg shadow-md"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
              <p className="text-gray-600 mt-2">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
