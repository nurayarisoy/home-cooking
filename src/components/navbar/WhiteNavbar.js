// WhiteNavbar.js

import React from 'react';
import 'tailwindcss/tailwind.css'


const WhiteNavbar = () => {
  return (
    <nav className="bg-gray-200 p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Logo</div>
      <div className="space-x-4">
        <a href="#" className="text-gray-700 hover:text-gray-900">Chef Login</a>
        <a href="#" className="text-gray-700 hover:text-gray-900">Customer Login</a>
      </div>
    </nav>
  );
};

export default WhiteNavbar;

