import Link from 'next/link';

const WhiteNavbar = () => {
  return (
    <nav className="bg-green-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">Logo</div>
        <div className="flex space-x-4">
          <Link href="/" legacyBehavior>
            <a className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">Home</a>
          </Link>
          <Link href="/about" legacyBehavior>
            <a className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">About</a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">Contact</a>
          </Link>
          <Link href="/login" legacyBehavior>
            <a className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">Login</a>
          </Link>
          <Link href="/register" legacyBehavior>
            <a className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">Register</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default WhiteNavbar;
