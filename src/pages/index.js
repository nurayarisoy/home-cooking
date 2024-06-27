import WhiteNavbar from '../components/navbar/WhiteNavbar';
import Footer from '../components/footer/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <WhiteNavbar />
      <div className="flex flex-col items-center justify-center flex-grow">
        <img src="/chefbild.png" alt="Centered Image" className="mb-4" />
      </div>
      <Footer />
    </div>
  );
}
