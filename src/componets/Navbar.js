// Navbar.js

import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold">Dashboard</div>
                <div>
                    <a href="#" className="text-white mr-4">Link 1</a>
                    <a href="#" className="text-white mr-4">Link 2</a>
                    <a href="#" className="text-white mr-4">Link 3</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
