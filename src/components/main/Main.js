import "../../../styles/tailwind.css";


// Main component
const Main = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <main className="relative flex flex-col items-center justify-center flex-grow w-full overflow-hidden">
        {/* Video bileşeni eklendi */}
        <div className="relative w-full h-screen">
  <video
    src="/my.mp4" // Videonuzun yolu
    controls
    className="w-full h-screen object-cover"
  />
  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 flex flex-col space-y-4">
    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
      <img src="/facebook.png" alt="Facebook" className="w-14 h-14 transition-transform duration-300 hover:scale-110 hover:shadow-lg" />
    </a>
    <div className="bg-white ">
  <img src="/x.png" alt="Facebook" className="w-14 h-14 transition-transform duration-300 hover:scale-110 hover:shadow-lg"/>
</div>
    <div>
    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
      <img src="/instagram.png" alt="Instagram" className="w-14 h-14 transition-transform duration-300 hover:scale-110 hover:shadow-lg" />
    </a>
    </div>
  </div>
</div>

        {children}

        <div className="w-full bg-grid-pattern bg-blue-150 ">
          {/* İlk satır - Başlık, açıklama ve resim */}
          <div className="flex items-center justify-center mb-8">
            {/* Sol tarafta PNG resim */}
            <div className="w-1/4 mt-4  ">
              <img
                src="/chefbild.png"
                alt="Home Cooking Image"
                className=" h-auto shadow-lg rounded-full "
                style={{ boxShadow: "0 4px 6px rgba(0, 0, 255, 0.5) " }}
              />
            </div>

            <div className="w-2/3 text-right  ">
              <h1 className="text-center font-bold mb-4">Home Cooking</h1>
              <p className="text-gray-700 text-center">
                This is a sample description text that provides information
                about the website.
              </p>
              <p className="mt-4 text-center   p-4 text-gray-600">
                Home Cooking, sağlıklı ve lezzetli yemek tariflerinin
                paylaşıldığı bir platformdur. Tariflerimizle evde harika
                yemekler yapabilirsiniz.
              </p>
            </div>
          </div>

          {/* İkinci satır - QR kodu ve resim */}
          <div className="flex items-center justify-center">
            {/* QR kodu */}
            <div className="w-1/2 text-center">
              <img
                src="/Layer 1.jpg"
                alt="QR Code"
                className="w-1/6 mx-auto shadow-lg rounded-md"
              />
            </div>

            {/* Yanına resim */}
            <div className="w-1/2 mb-8">
              <img
                src="/chef.webp"
                alt="Additional Image"
                className="w-full h-auto shadow-lg rounded-full"
                style={{ boxShadow: "0 4px 6px rgba(0, 0, 255, 0.5)" }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
