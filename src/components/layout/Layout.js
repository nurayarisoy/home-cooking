// components/Layout.js
// components/Layout.js

import React from 'react';
import Navbar from '../navbar/Navbar' // Navbar bileşenini import edin
import Footer from'../footer/Footer'; // Footer bileşenini import edin

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <Navbar /> {/* Navbar bileşenini buraya ekleyin */}
      </header>
      <main>
        {children}
      </main>
      <footer>
        <Footer /> {/* Footer bileşenini buraya ekleyin */}
      </footer>
    </div>
  );
}

export default Layout;
