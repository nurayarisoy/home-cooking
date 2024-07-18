// src/components/main/Main.js
import '../../../styles/tailwind.css';

const Main = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="animate-color-change flex flex-col items-center justify-center flex-grow w-full max-w-4xl px-4 py-8 bg-white shadow-md rounded-lg">
        <img
          src="/chef3.png"
          alt="Centered Image"
          className="mb-8 w-full h-auto max-w-sm object-cover rounded-lg"
        />
        {children}
        <h1 className="text-3xl font-bold mb-4">Home Cooking</h1>
        <p className="text-gray-700 text-center">
          This is a sample description text that provides information about the website.
        </p>
      </main>
    </div>
  );
};

export default Main;
