// pages/login/LoginPage.js
import Navbar from '../../components/navbar/Navbar'; // Navbar bileşenini import edin

const ChefLoginPage = () => {
  return (
    <div>
      <Navbar /> {/* Navbar bileşenini ekleyin */}
      <h1>Chef Login</h1>
      <form>
        {/* Kullanıcı adı ve şifre alanları */}
        {/* Resim yükleme alanı */}
        {/* Tarif yazma alanı */}
        <button type="submit">Login</button>
      </form>
      {/* Diğer içeriği buraya ekleyin */}
    </div>
  );
};

export default ChefLoginPage;

