// pages/index.js
import Layout from '../components/layout/Layout';
import WhiteNavbar from '../components/navbar/WhiteNavbar';


const HomePage = () => {
  return (
    <Layout>
     <WhiteNavbar />
      {/* Diğer içeriği ve resmi buraya ekleyin */}
      <video controls>
      <source src="/video.mp4" type="video/mp4" />
      Tarayıcınız video etiketini desteklemiyor.
    </video>
    </Layout>
  );
};

export default HomePage;

