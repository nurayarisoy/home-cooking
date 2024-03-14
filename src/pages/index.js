// pages/index.js
import Layout from '../components/layout/Layout';
import Navbar from '../components/navbar/Navbar';

const HomePage = () => {
  return (
    <Layout>
     <Navbar />
      {/* Diğer içeriği ve resmi buraya ekleyin */}
      <video controls>
      <source src="/video.mp4" type="video/mp4" />
      Tarayıcınız video etiketini desteklemiyor.
    </video>
    </Layout>
  );
};

export default HomePage;

