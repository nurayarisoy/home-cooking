const Footer = () => {
  return (
    <footer className="bg-black text-white p-4">
      <div className="flex flex-row ">
        {/* Sol Bölüm: Home Cooking ve Paragraf */}
        <div className="flex-1 flex flex-col justify-center p-4">
          <h4 className="text-3xl font-bold mb-4">Home Cooking</h4>
          <p className="text-lg">
            Kunden haben die Möglichkeit, mithilfe von Google Maps nach Köchen
            und Köchinnen in Ihrer Nähe zu suchen und Bestellungen aufzugeben.
          </p>
        </div>

        {/* Orta Bölüm: CONTACT US */}
        <div className="flex-1 flex p-4">
          <h4 className="text-3xl font-bold mb-4">CONTACT US</h4>
        </div>
      </div>

      {/* İkinci Bölüm: Copyright Bilgisi */}

      {/* Üçüncü Bölüm: Sosyal Medya İkonları */}
      <div className="flex justify-center space-x-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/facebook.png"
            alt="Facebook"
            className="w-14 h-14 transition-transform duration-300 hover:scale-110 hover:shadow-lg"
          />
        </a>
        <div className="bg-white ">
          <a href="https://x.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/x.png"
              alt="X"
              className="w-14 h-14 transition-transform duration-300 hover:scale-110 hover:shadow-lg"
            />
          </a>
        </div>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/instagram.png"
            alt="Instagram"
            className="w-14 h-14 transition-transform duration-300 hover:scale-110 hover:shadow-lg"
          />
        </a>
      </div>
      <div className="text-center mb-4">
        &copy; 2024 Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
