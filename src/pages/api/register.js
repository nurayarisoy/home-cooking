import { database, ref, set } from '../../../firebaseConfig'; // Firebase yapılandırmasını dahil et
import axios from 'axios';

// Maps API ile adresi alma
const getAddressFromCoordinates = async (latitude, longitude) => {
  const apiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Google Maps API anahtarınızı buraya ekleyin
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    return response.data.results[0]?.formatted_address || "Address not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Error fetching address";
  }
};

// Kullanıcıyı Firebase veritabanına kaydetme
async function registerUser(user) {
  const { username, email, password, latitude, longitude } = user;
  
  // Harita API'si ile adresi al
  const address = await getAddressFromCoordinates(latitude, longitude);

  // Firebase'e kullanıcıyı kaydet
  await set(ref(database, 'users/' + email.replace('.', ',')), {
    username,
    email,
    password,
    latitude,
    longitude,
    address,
  });
}

// API handler
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password, latitude, longitude } = req.body;

    try {
      // Firebase işlemleri
      await registerUser({ username, email, password, latitude, longitude });

      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Firebase Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
