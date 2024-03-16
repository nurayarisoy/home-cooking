// pages/_app.js
import React from 'react';
import { DataProvider } from '../context/DataContext';
import '../styles/globals.css'; // Tailwind CSS global stil dosyasını ekleyin
import 'tailwindcss/tailwind.css';
import WhiteNavbar from '../components/navbar/WhiteNavbar';
import Footer from'../components/footer/Footer';
import Layout from'../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      Navbar bileşenini sayfa içeriğinin üstüne ekleyin
      <WhiteNavbar />
      {/* Layout bileşenini Navbar ve Footer bileşenleri arasına yerleştirin */}
      <Layout>
        {/* Diğer bileşenler */}
        <Component {...pageProps} />
      </Layout>
      {/* Footer bileşenini sayfa içeriğinin altına ekleyin */}
      <Footer />
    </DataProvider>
  );
}

export default MyApp;


