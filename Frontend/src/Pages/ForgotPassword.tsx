// src/components/ForgotPassword.tsx
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ForgotPassword: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [step, setStep] = useState<'request' | 'verify' | 'reset'>('request');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Formik setup for email request
  const emailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      // Simulated API call to send OTP
      const emailExists = await fakeApiCheckEmail(values.email);
      if (emailExists) {
        setMessage('OTP sent to your email!');
        setIsError(false);
        setStep('verify'); // Move to the OTP verification step
      } else {
        setMessage('Email not found!');
        setIsError(true);
      }

      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    },
  });

  // Simulated API call to check email
  const fakeApiCheckEmail = (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDatabase = ['test@example.com', 'user@example.com'];
        resolve(mockDatabase.includes(email));
      }, 1000);
    });
  };

  // Handle OTP verification
  const handleOtpVerification = async () => {
    // Simulated OTP check
    const isOtpCorrect = otp === '123456'; // Example static OTP for demo
    if (isOtpCorrect) {
      setStep('reset');
      setMessage('OTP verified! Please set your new password.');
    } else {
      setMessage('Invalid OTP!');
      setIsError(true);
    }
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  // Handle password reset
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
        setIsError(true);
        setMessage("Passwords don't match!");
      return;
    }

    // Here you would typically send the new password to your API
    console.log('New password:', newPassword);
    setIsError(false);
    setMessage('Password has been reset successfully!');
    
    // Reset form and states
    setNewPassword('');
    setConfirmPassword('');
    setOtp('');
    setStep('reset');

    // Clear message after 5 seconds
    setTimeout(() => {
        setMessage('Redirecting to home page...');
        window.location.href = '/';
    }, 3000);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {step === 'request'
            ? 'Forgot Password'
            : step === 'verify'
            ? 'Verify OTP'
            : 'Reset Password'}
        </h1>
       
        {step === 'request' && (
          <form onSubmit={emailFormik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-lg">Email</label>
              <input
                id="email"
                type="email"
                {...emailFormik.getFieldProps('email')}
                className={`border p-3 rounded w-full ${emailFormik.touched.email && emailFormik.errors.email ? 'border-red-500' : ''}`}
                placeholder="Email"
              />
              {emailFormik.touched.email && emailFormik.errors.email ? (
                <div className="text-red-500 text-sm">{emailFormik.errors.email}</div>
              ) : null}
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
            >
              Send OTP
            </button>
          </form>
        )}
        
        {step === 'verify' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="otp" className="block mb-2 text-lg">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-3 rounded w-full"
                placeholder="OTP"
              />
            </div>
            <button
              onClick={handleOtpVerification}
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 'reset' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block mb-2 text-lg">New Password</label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-3 rounded w-full"
                placeholder="New Password"
              />
            </div>
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-lg">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-3 rounded w-full"
                placeholder="Confirm Password"
              />
            </div>
            <button
              onClick={handlePasswordReset}
              className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition duration-200"
            >
              Reset Password
            </button>
          </div>
          
        )}
         {message && (
          <div className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
