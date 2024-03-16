// components/Layout.js
// components/Layout.js

import React from 'react';
import WhiteNavbar from '../navbar/WhiteNavbar' // Navbar bileşenini import edin
import Footer from'../footer/Footer'; // Footer bileşenini import edin

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header>
        <WhiteNavbar /> {/* Navbar bileşenini buraya ekleyin */}
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
