// pages/login/LoginPage.js
import React from 'react';
import WhiteNavbar from '../../components/navbar/WhiteNavbar';

import styles from './LoginPage.css'; // Login.css dosyasını doğru yoldan içe aktarın
import './Login.css';

const ChefLoginPage = () => {
  return (
    <div>
      <WhiteNavbar /> {/* Navbar bileşenini ekleyin */}
      <h1>Chef Login</h1>
      <form className={styles['custom-form']}>
        {/* Kullanıcı adı ve şifre alanları */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Kullanıcı Adı
          </label>
          <input
            className={`${styles['username-input']}`} // Tailwind CSS stil sınıfını burada kullanın
            id="username"
            type="text"
            placeholder="Kullanıcı adınızı girin"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Şifre
          </label>
          <input
            className={`${styles['password-input']}`} // Tailwind CSS stil sınıfını burada kullanın
            id="password"
            type="password"
            placeholder="Şifrenizi girin"
          />
        </div>
        {/* Resim yükleme alanı */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
            Resim Yükle
          </label>
          <input
            className={`${styles['image-upload']}`} // Tailwind CSS stil sınıfını burada kullanın
            id="image"
            type="file"
          />
        </div>
        {/* Tarif yazma alanı */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipe">
            Tarif Yaz
          </label>
          <textarea
            className={`${styles['recipe-textarea']}`} // Tailwind CSS stil sınıfını burada kullanın
            id="recipe"
            rows="4"
            placeholder="Tarifinizi buraya yazın"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {/* Diğer içeriği buraya ekleyin */}
    </div>
  );
};

export default ChefLoginPage;

