import WhiteNavbar from "../components/navbar/WhiteNavbar";
import Footer from "../components/footer/Footer";
import Main from "../components/main/Main";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <WhiteNavbar />
      <Main />

      <Footer />
    </div>
  );
}
