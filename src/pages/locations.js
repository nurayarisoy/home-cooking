// pages/locations.js
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

export default function Locations() {
  const [users, setUsers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([51.505, -0.09]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-slate-100 py-16 px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-10 shadow-2xl ring-1 ring-slate-200">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-600">Standorte</p>
          <h1 className="mt-4 text-4xl font-extrabold text-slate-950">Finde Nutzer in deiner Nähe</h1>
          <p className="mt-5 text-slate-600 leading-7">
            Entdecke andere Hobbyköche in deiner Umgebung und sieh dir ihre Standorte auf der Karte an.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-slate-200">
          <div className="rounded-[1.75rem] overflow-hidden border border-slate-200">
            <Map center={currentLocation} zoom={13} style={{ height: '520px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={currentLocation}>
                <Popup>Dein Standort</Popup>
              </Marker>
              {users.map((user) => (
                <Marker key={user._id} position={[user.location.latitude, user.location.longitude]}>
                  <Popup>{user.username}</Popup>
                </Marker>
              ))}
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
}
