import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { setLoading, setAuthenticated } from "../store/authSlice";
interface IHeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const Header: React.FC<IHeaderProps> = ({ isAuthenticated, loading }) => {
  const dispatch = useDispatch<AppDispatch>();

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
        dispatch(setAuthenticated(null));
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
          <a href="/" aria-label="EasyURL Homepage">
            EasyURL.me
          </a>
        </h1>
        <nav aria-label="Primary Navigation">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <li>
                    <a href="/dashboard" className="text-sm hover:underline">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={handleLogout}
                      className="text-sm hover:underline cursor-pointer"
                    >
                      Logout
                    </a>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <a href="/login" className="text-sm hover:underline">
                      Login
                    </a>
                  </li>
                  <li>
                    <a href="/signup" className="text-sm hover:underline">
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
