// pages/_app.js

import '../../styles/globals.css' // Doğru dosya yolu
import WhiteNavbar from '../components/navbar/WhiteNavbar';
import Footer from '../components/footer/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <div className="flex flex-col min-h-screen">
      <WhiteNavbar />
      <main className="flex-grow flex items-center justify-center bg-white">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;

