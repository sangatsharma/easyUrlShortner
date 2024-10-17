import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

const QRCodeGenerator: React.FC<{ url: string }> = (props) => {
  const [qrImageUrl, setQrImageUrl] = useState(""); // Store the QR code image URL
  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    generateQrCode();
  }, [props.url]);

  // Generate QR Code on button click
  const generateQrCode = async () => {
    try {
      const url = await QRCode.toDataURL(props.url);
      setQrImageUrl(url); // Store QR code data URL
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  // Download the QR code image
  const downloadQrCode = () => {
    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = "qrcode.png"; // Download as PNG file
    link.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4 ">
      {/*      
      <input
        type="text"
        placeholder="Enter text or link"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border p-2 rounded w-80"
      />
      <button
        onClick={generateQrCode}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Generate QR Code
      </button> */}

      {qrImageUrl && (
        <>
          <img
            src={qrImageUrl}
            alt="Generated QR Code"
            ref={canvasRef}
            className="mt-4 border p-2"
          />
          <button
            onClick={downloadQrCode}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Download QR Code
          </button>
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
