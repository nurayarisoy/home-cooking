// pages/_app.js
import React from 'react';
import { DataProvider } from '../context/DataContext';
import '../styles/globals.css'; // Tailwind CSS global stil dosyasını ekleyin
import 'tailwindcss/tailwind.css';
import Navbar from '../components/navbar/Navbar';
import Footer from'../components/footer/Footer';
import Layout from'../components/layout/Layout';


function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      {/* Navbar bileşenini DataProvider bileşeninin içine ekleyin */}
      <Navbar />
      <Footer />
      <Layout />
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;


