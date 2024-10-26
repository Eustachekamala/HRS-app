import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsersCog, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="md:hidden">
                    {/* Mobile Menu Button (Optional) */}
                    <button className="text-white focus:outline-none">
                        {/* Add a hamburger icon here if needed */}
                    </button>
                </div>
                <ul className="hidden md:flex space-x-4">
                    <li>
                        <Link to="/technicians" className="flex items-center hover:text-gray-400">
                            <FaUsersCog className="mr-2" /> Technicians
                        </Link>
                    </li>
                    <li>
                        <Link onClick={() => navigate('/notfound')} className="flex items-center hover:text-gray-400">
                            <FaClipboardList className="mr-2" /> Reports
                        </Link>
                    </li>
                    <li>
                        <Link to="/" className="flex items-center hover:text-gray-400">
                            <FaSignOutAlt className="mr-2" /> Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminNavbar;
