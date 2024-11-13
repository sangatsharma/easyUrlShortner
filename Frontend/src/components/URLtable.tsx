import { useEffect, useState } from "react";
import ShortLinkDisplay from "./ShortLinkDisplay";
import { getFormattedDate } from "../utils/getFormattedDate";
import { generateQrCode } from "../utils/generateQrCode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { deleteLink } from "../store/linkSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const UrlTable: React.FunctionComponent = () => {
  const { links, loading } = useSelector((state: RootState) => state.links);
  const dispatch = useDispatch<AppDispatch>();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleShortUrlDelete = async (id: string) => {
    try {
      setDeleteId(id);
      const response = await axios.delete(
        `${import.meta.env.VITE_SERVER_URL}/api/shorturl/${id}`,
        { withCredentials: true }
      );
      const data = response.data;
      console.log(response.data);
      if (data.success) {
        dispatch(deleteLink(id));
      }
    } catch (err) {
      console.error("Error fetching URLs:", err);
    } finally {
      setDeleteId(null);
    }
  };

  const [qrLinks, setQrLinks] = useState<(string | undefined)[]>([]);
  // Generate QR code for the given URL
  useEffect(() => {
    fetchQrCodes();
  }, [qrLinks]);
  const fetchQrCodes = async () => {
    const generatedQrCodes: (string | undefined)[] = await Promise.all(
      links.map((item) => generateQrCode(`https://easyurl.me/${item.shortId}`))
    );
    setQrLinks(generatedQrCodes);
  };

  // Download the QR code image
  const downloadQrCode = (url: string | undefined) => {
    if (!url) {
      console.error("Error downloading QR code: URL is undefined");
      url = "https://easyurl.me";
    }
    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png"; // Download as PNG file
    link.click();
  };

  return (
    <div className="container w-full mx-auto  py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        URL Shortener Records
      </h1>
      <div className="overflow-x-auto">
        {loading && <p className="text-center">Loading...</p>}
        {!loading && links.length === 0 ? (
          <p className="text-center">No URLs found.</p>
        ) : (
          <table className="w-full  border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="border border-gray-300 px-4 py-2">S.N</th>
                <th className="border border-gray-300 px-4 py-2 ">Full URL</th>
                <th className="border border-gray-300">Short URL</th>
                <th className="border border-gray-300 px-4 py-2">
                  Date Shortened
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Expiry Date
                </th>
                <th className="border border-gray-300 px-4 py-2">QR Code</th>
                <th className="border border-gray-300 px-4 py-2">Clicks</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {links.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-200`}
                  >
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 break-all">
                      <p className="w-48">
                        <a
                          href={item.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          {item.originalUrl}
                        </a>
                      </p>
                    </td>
                    <td className="border border-gray-300">
                      <div className="w-72 mx-auto">
                        <ShortLinkDisplay
                          shortLink={`easyurl.me/${item.shortId}`}
                          hide={true}
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {getFormattedDate(item.createdAt)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {getFormattedDate(item.expiryDate)}
                    </td>
                    <td className="border border-gray-300 py-1">
                      <img
                        src={qrLinks[index]}
                        alt="Generated QR Code"
                        className="border mx-auto"
                      />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {item.uniqueClicks}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center  ">
                      <div className="flex flex-col gap-2 ">
                        <button
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          onClick={() => handleShortUrlDelete(item.shortId)}
                        >
                          {deleteId == item.shortId ? "Deleting..." : "Delete"}
                        </button>
                        <button
                          onClick={() => downloadQrCode(qrLinks[index])}
                          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                        >
                          Download QR
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UrlTable;
