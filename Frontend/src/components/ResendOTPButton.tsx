import React, { useState, useEffect } from "react";
import axios from "axios";
// Define the props type
interface ResendOTPButtonProps {
  initialTime?: number; // Optional prop: countdown time in seconds
  setError: (message: string | null) => void; // Optional prop: callback when OTP is resent
  userEmail: string;
}

const ResendOTPButton: React.FC<ResendOTPButtonProps> = ({
  initialTime = 120, // Default to 60 seconds if not provided
  setError,
  userEmail,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  // Handle countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsDisabled(false); // Enable button after countdown ends
    }

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [timeLeft]);

  // Handle button click
  const handleResendClick = async () => {
    setIsDisabled(true); // Disable button after click
    setTimeLeft(initialTime); // Start countdown from initial time
    try {
      console.log("Resending OTP...to", userEmail);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/user/resendOtp`,
        {
          email: userEmail as string,
        },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
      if (!data.success) {
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      } else {
        setError(data.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
      setTimeout(() => {
        setError(null);
      }, 3000);
      console.log("Failed to resend otp.", err);
    }
  };

  return (
    <div className="flex justify-end">
      <span
        onClick={() => {
          if (!isDisabled) handleResendClick();
        }}
        className={`p-2  text-sm   ${
          isDisabled
            ? "cursor-not-allowed"
            : "text-blue-500 hover:underline cursor-pointer"
        }`}
      >
        {isDisabled ? `Resend OTP in ${timeLeft} s` : "Resend OTP"}
      </span>
    </div>
  );
};

export default ResendOTPButton;
