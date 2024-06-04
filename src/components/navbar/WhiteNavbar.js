import { useState } from 'react';
import Link from 'next/link';

const WhiteNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-yellow-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Logo</div>
        <div className="hidden md:flex space-x-4">
          <Link href="/" legacyBehavior>
            <a className="hover:text-gray-200">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="hover:text-gray-200">About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="hover:text-gray-200">Contact</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="hover:text-gray-200">Login</a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a className="hover:text-gray-200">Register</a>
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
            ☰
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <Link href="/" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-yellow-600">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-yellow-600">About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-yellow-600">Contact</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-yellow-600">Login</a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a className="block px-4 py-2 hover:bg-yellow-600">Register</a>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default WhiteNavbar;
