import QRCode from "qrcode";

// Generate QR Code on button click
export const generateQrCode = async (url: string) => {
  try {
    const qrUrl = await QRCode.toDataURL(url);
    if (!qrUrl) {
      console.log("Error generating QR code for : ", url);
      return "";
    }
    return qrUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
  }
};
