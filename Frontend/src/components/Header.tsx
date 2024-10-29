import React from "react";
interface IHeaderProps {
  isAuthenticated: boolean;
  loading: boolean;
}

const Header: React.FC<IHeaderProps> = ({ isAuthenticated, loading }) => {
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
                    <a href="/logout" className="text-sm hover:underline">
                      Logout
                    </a>
                  </li>
                </>
              ) : (<>
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
