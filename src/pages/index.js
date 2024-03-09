// pages/index.js
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer'; // Footer bileşenini import edin
import 'tailwindcss/tailwind.css';

const HomePage = () => {
  return (
    <div>
      <Navbar />
     
      <div>
      <div class="content">
    <video controls>
      <source src="/video.mp4" type="video/mp4" />
      Tarayıcınız video etiketini desteklemiyor.
    </video>
    </div>
  </div>
 
      <Footer /> {/* Footer bileşenini ekleyin */}
    </div>
  );
};

export default HomePage;

