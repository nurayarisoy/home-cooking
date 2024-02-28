// pages/_app.js
import React from 'react';
import { DataProvider } from '../context/DataContext';
import '../styles/globals.css';
import Navbar from '../components/Navbar';


function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
   {/* Navbar bileşenini DataProvider bileşeninin içine ekleyin */}
        <Navbar/>
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;

