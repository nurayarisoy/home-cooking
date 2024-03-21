// pages/_app.js


import React from 'react';
import { DataProvider } from '../context/DataContext';
import '../styles/globals.css'; // Tailwind CSS global stil dosyasını ekleyin
import 'tailwindcss/tailwind.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import WhiteNavbar from '../components/navbar/WhiteNavbar';
import Footer from '../components/footer/Footer';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <WhiteNavbar />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </DataProvider>
  );
}

export default MyApp;



