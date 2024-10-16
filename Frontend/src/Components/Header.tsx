import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md" role="banner">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/" aria-label="EasyURL Homepage">
            EasyURL.me
          </a>
        </h1>

        <nav aria-label="Primary Navigation">
          <ul className="flex space-x-4">
            <li>
              <a
                href="/"
                className="text-sm hover:underline"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="text-sm hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="text-sm hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
