import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Link to="/" className="text-xl font-semibold text-gray-900">
          My Trips
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
