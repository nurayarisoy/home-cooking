import Head from 'next/head';

export default function About() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      
      <a href="/" className="block">
  <img
    className="h-16 w-auto animate-spin object-cover rounded-full transform hover:scale-175 transition-transform duration-300 
               ml-4 mt-4" // Sağa ve aşağıya kaydırma
    src="/chef1.png"
    alt="Logo"
  />
</a>
                 
      <Head>
        <title>About Us</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:w-1/2 h-64 md:h-auto bg-cover bg-center" style={{ backgroundImage: "url('/chef.png')" }}>
        {/* Alternatif olarak, img etiketi kullanılabilir */}
        {/* <img src="/path-to-your-image.jpg" alt="About Image" className="w-full h-full object-cover" /> */}
      </div>
      <div className="flex items-center justify-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl mb-4">About Us</h2>
          <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
            Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.
          </p>
          <p className="mb-4">
            Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad
            litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero.
          </p>
          <p>
            Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis.
            Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis,
            luctus non, massa.
          </p>
        </div>
      </div>
    </div>
  );
}
