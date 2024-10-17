import QRCodeGenerator from "./QRCodeGenerator";

// Sample data (this can be dynamic from props or API)
const sampleData = [
  {
    fullUrl: "https://example.com",
    shortUrl: "https://easyurl.me/abcd",
    dateShortened: "2024-10-17",
    expiryDate: "2025-10-17",
  },
  {
    fullUrl: "https://google.com",
    shortUrl: "https://easyurl.me/xyz",
    dateShortened: "2024-10-16",
    expiryDate: "2025-04-16",
  },
  {
    fullUrl: "https://example.com",
    shortUrl: "https://easyurl.me/abcd",
    dateShortened: "2024-10-17",
    expiryDate: "2025-10-17",
  },
  {
    fullUrl: "https://google.com",
    shortUrl: "https://easyurl.me/xyz",
    dateShortened: "2024-10-16",
    expiryDate: "2025-04-16",
  },
];

const UrlTable: React.FC<{ links: Array<{}> }> = (props) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        URL Shortener Records
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 shadow-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="border border-gray-300 px-4 py-2">S.N</th>
              <th className="border border-gray-300 px-4 py-2">Full URL</th>
              <th className="border border-gray-300 px-4 py-2">Short URL</th>
              <th className="border border-gray-300 px-4 py-2">
                Date Shortened
              </th>
              <th className="border border-gray-300 px-4 py-2">Expiry Date</th>
              <th className="border border-gray-300 px-4 py-2">QR Code</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                } hover:bg-gray-200`}
              >
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={item.fullUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {item.fullUrl}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {item.shortUrl}
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {item.dateShortened}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {item.expiryDate}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <QRCodeGenerator url={item.shortUrl} />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => alert(`Deleting ${item.shortUrl}`)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UrlTable;
