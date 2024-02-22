// pages/index.js

import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4">
      {/* Navbar */}
      <nav className="flex items-center justify-between py-4">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-8 mr-4" />
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="text-gray-600 hover:text-black">const-use</a>
          <a href="#" className="text-gray-600 hover:text-black">Hizmetler</a>
          <a href="#" className="text-gray-600 hover:text-black">Kominikation</a>
        </div>
      </nav>
      
      {/* İçerik */}
      <div className="flex justify-center mt-8">
        {/* Resim */}
        <img src="/image.jpg" alt="Resim" className="w-1/2" />
        
        {/* İçerik */}
        <div className="ml-8">
          <h2 className="text-2xl font-bold mb-4">home-cooking</h2>
          <p className="text-gray-600">İçerik buraya gelecek...</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

