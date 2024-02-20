// dashboard.js

import React from 'react';
import Navbar from '../components/Navbar';
import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

const Dashboard = () => {
    const { user } = useContext(DataContext); // Örnek olarak, kullanıcı bilgilerini global bir bağlamdan alıyoruz.

    return (
        <div>
            <Navbar />
            <div className="container mx-auto mt-8">
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 shadow rounded-lg">
                        <img src="https://via.placeholder.com/150" alt="Placeholder" className="w-full" />
                    </div>
                    <div className="col-span-2 bg-white p-4 shadow rounded-lg">
                        <h2 className="text-lg font-bold mb-4">HOME COOKING</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget turpis malesuada, sagittis nisi et, cursus tortor.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
