import '../../../styles/tailwind.css';

const Main = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="relative flex flex-col items-center justify-center flex-grow w-full overflow-hidden">
        
        {/* Video bileşeni eklendi */}
        <video
          src="/my.mp4" // Videonuzun yolu
          controls
          className="w-full h-screen object-cover"
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
