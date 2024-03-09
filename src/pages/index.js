// pages/index.js
import Layout from '../components/layout/Layout';

const HomePage = () => {
  return (
    <Layout>
      <h1>Hoş Geldiniz!</h1>
      {/* Diğer içeriği ve resmi buraya ekleyin */}
      <video controls>
      <source src="/video.mp4" type="video/mp4" />
      Tarayıcınız video etiketini desteklemiyor.
    </video>
    </Layout>
  );
};

export default HomePage;

