import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { setLoading, logout } from "../store/authSlice";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";



interface IHeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const Header: React.FC<IHeaderProps> = ({ isAuthenticated, loading }) => {
  const {userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/user/auth/logout`,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      console.log(data);
      if (data.success) {
        dispatch(logout());
        window.location.href = "/";
      } else {
        console.log("Failed to logout. Please try again.");
      }
    } catch (err) {
      console.log("Failed to login. Please try again.", err);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <header className="bg-primary text-white p-4 shadow-md" role="banner">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" aria-label="EasyURL Homepage">
            EasyURL.me
          </Link>
        </h1>
        <nav aria-label="Main Navigation">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <li>
                    <Link
                      to="/dashboard"
                      className="text-sm hover:underline"
                      aria-label="Go to Dashboard"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <a
                      onClick={handleLogout}
                      className="text-sm hover:underline cursor-pointer"
                      role="button"
                      aria-label="Logout"
                    >
                      Logout
                    </a>
                  </li>

                  <li>
                    <div className="relative inline-block text-left">
                      {/* Dropdown Button */}
                      <button
                        onClick={toggleDropdown}
                        className="inline-flex justify-center w-full text-sm font-medium text-white cursor-pointer rounded-md focus:outline-none hover:underline"
                        aria-label="Settings Dropdown"
                      >
                        {userInfo?.name}
                        <svg
                          className="w-5 h-5 ml-2 -mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && (
                        <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <a
                              href="/deactivate-account"
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-block"
                              aria-label="Deactivate Account"
                            >
                              <button>Deactivate Account</button>
                            </a>
                            <a
                              href="/forgot-password"
                              className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 inline-block"
                              aria-label="Change Password"
                            >
                              Change Password
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a
                      href="/login"
                      className="text-sm hover:underline"
                      aria-label="Login to your account"
                    >
                      Login
                    </a>
                  </li>
                  <li>
                    <a
                      href="/signup"
                      className="text-sm hover:underline"
                      aria-label="Sign up for a new account"
                    >
                      Signup
                    </a>
                  </li>
                </>
              )}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
