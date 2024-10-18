import React, {  useRef, useEffect } from "react";
import QRCode from "qrcode";

const QRCodeGenerator: React.FC<{ url: string ,qrImageUrl:string,setQrImageUrl:(text:string)=>void,}> = (props) => {

  const canvasRef = useRef(null); // Reference to the canvas element

  useEffect(() => {
    generateQrCode();
  }, [props.url]);

  // Generate QR Code on button click
  const generateQrCode = async () => {
    try {
      const url = await QRCode.toDataURL(props.url);
      props.setQrImageUrl(url); // Store QR code data URL
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
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

      {props.qrImageUrl && (
        <>
          <img
            src={props.qrImageUrl}
            alt="Generated QR Code"
            ref={canvasRef}
            className=" border"
          />
          
        </>
      )}
    </div>
  );
};

export default QRCodeGenerator;
