// WhiteNavbar.js

import React from 'react';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';

const WhiteNavbar = () => {
  const router = useRouter();

  const handleChefLoginClick = () => {
    router.push('/login');
  };

  return (
    <nav className="bg-gray-200 p-4 flex justify-between items-center">
      <div className="text-lg font-bold">Logo</div>
      <div className="space-x-4">
        <a href="#" className="text-gray-700 hover:text-gray-900" onClick={handleChefLoginClick}>Chef Login</a>
        <a href="#" className="text-gray-700 hover:text-gray-900">Customer Login</a>
      </div>
    </nav>
  );
};

export default WhiteNavbar;
;

