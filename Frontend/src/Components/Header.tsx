import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">EasyURL.me</h1>
        <nav>
          <a href="#" className="text-sm hover:underline">Home</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
