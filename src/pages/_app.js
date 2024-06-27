// pages/_app.js

// pages/_app.js
import '../../styles/tailwind.css';
import { DataProvider } from '../context/DataContext';

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;


