// components/Layout.js
// components/Layout.js

// import React from 'react';
// import WhiteNavbar from '../navbar/WhiteNavbar' // Navbar bileşenini import edin
// import Footer from'../footer/Footer'; // Footer bileşenini import edin

// const Layout = ({ children }) => {
//   return (
//     <div className="layout">
//       <header>
//         <WhiteNavbar /> {/* Navbar bileşenini buraya ekleyin */}
//       </header>
//       <main>
//         {children}
//       </main>
//       <footer>
//         <Footer /> {/* Footer bileşenini buraya ekleyin */}
//       </footer>
//     </div>
//   );
// }

// export default Layout;

// components/Layout.js
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-xl">My Website</h1>
          <nav>
            <Link href="/"><a className="mr-4">Home</a></Link>
            <Link href="/about"><a>About</a></Link>
            <Link href="/contact"><a>Contact</a></Link>
            <Link href="/login"><a>Login</a></Link>
            <Link href="/register"><a>Register</a></Link>
          </nav>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center min-h-screen">
        {children}
      </main>
      <footer>
        <p>© 2024 My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;

