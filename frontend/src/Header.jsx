// src/components/Header.jsx
import React from 'react';
const Header = ({ toggleDarkMode }) => {
    return (
        <header className="py-4 border-b border-gray-300 bg-white flex items-center px-6">
            <h1 className="text-3xl font-bold"> Exploring Deep Learning and Music Recommendations</h1>
        </header>
    );
};

export default Header;
