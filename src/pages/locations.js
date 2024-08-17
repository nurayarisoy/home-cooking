// pages/locations.js
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Leaflet bileşenlerini dinamik olarak yükleyin
const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Locations() {
  const [users, setUsers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]); // Varsayılan konum

  useEffect(() => {
    // Kullanıcıların konumlarını API'den çekin
    const fetchUsers = async () => {
      const response = await fetch('/api/users'); // API endpoint'inizi burada kullanın
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();

    // Kullanıcının mevcut konumunu alın
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Users</h1>
      <Map center={currentLocation} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={currentLocation}>
          <Popup>Your Location</Popup>
        </Marker>
        {users.map(user => (
          <Marker key={user._id} position={[user.location.latitude, user.location.longitude]}>
            <Popup>{user.username}</Popup>
          </Marker>
        ))}
      </Map>
    </div>
  );
}
