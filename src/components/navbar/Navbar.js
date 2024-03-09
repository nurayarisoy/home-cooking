// components/Navbar.js
import React from 'react';
import '../navbar/Navbar.css'; // Navbar bileşeninin CSS dosyasını import edin

const Navbar = () => {
  return (
    <div className="navbar"> {/* <Navbar> yerine <div className="navbar"> kullanın */}
      <p>&copy; 2024 My Next.js App</p>
    </div>
  );
}

export default Navbar