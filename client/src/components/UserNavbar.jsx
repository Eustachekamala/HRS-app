import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignOutAlt, FaUser, FaHome } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';

const UserNavbar = () => {
    const handleLogout = async () => { 
        try {
            await axios.post('https://hrs-app-1.onrender.com/logout'); 
            window.location.href = '/login';
        } catch (error) {
            console.error("Signout failed:", error);
        }
    };

    return (
        <nav className="bg-gray-800 text-white p-4 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-xl font-bold">
                    MyApp
                </div>
                <div className="space-x-4 flex items-center">
                    <Link to="/" className="flex items-center text-white hover:text-blue-200">
                        <FaHome className="mr-1" /> Home
                    </Link>
                    <Link to="/profile" className="flex items-center text-white hover:text-blue-200">
                        <FaUser className="mr-1" /> Profile
                    </Link>
                    <button 
                        onClick={handleLogout} 
                        className="flex items-center text-white hover:text-blue-200"
                    >
                        <FaSignOutAlt className="mr-1" /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

UserNavbar.propTypes = {
    onLogout: PropTypes.func.isRequired,
};

export default UserNavbar;
