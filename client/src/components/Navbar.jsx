import { useState } from 'react';
import { FaHome, FaTools, FaInfoCircle, FaComments, FaPhone, FaSign} from 'react-icons/fa';
import { useAuth } from '../configs/AuthContext'; // Use useAuth hook
function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const { user } = useAuth(); // Access user state from AuthContext

    const handleLogin = () => {
        if (!user) {
            // If user is not logged in, redirect to sign up page
            window.location.href = '/signup'; // Change this to your sign up route
        } else {
            // If user is logged in, redirect to login page
            window.location.href = '/login'; // Change this to your login route
        }
    };

    return (
        <div className="w-full sticky top-0 z-50 m-0 p-0">
            {/* Header */}
            <header className="flex justify-between items-center p-4 bg-gray-700 text-white shadow">
                <div className="logo text-xl font-bold">Home Repair Service</div>
                <button onClick={toggleMenu} className="md:hidden focus:outline-none">
                    {/* Hamburger Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                {/* Desktop Menu */}
                <nav className="hidden md:flex md:items-center md:flex-row">
                    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 p-4 md:p-0">
                        <li><a href="#home" className="flex items-center hover:underline">Home</a></li>
                        <li><a href="#services" className="flex items-center hover:underline">Services</a></li>
                        <li><a href="#about" className="flex items-center hover:underline">About</a></li>
                        <li><a href="#testimonials" className="flex items-center hover:underline">Testimonials</a></li>
                        <li><a href="#contact" className="flex items-center hover:underline">Contact</a></li>
                    </ul>
                </nav>
                <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-3 rounded w-24 shadow-md hover:bg-blue-700 transition duration-200">
                    Login 
                </button>
            </header>

            {/* Mobile Menu */}
            <nav className={`md:hidden bg-white shadow-md left-0 w-full rounded-br-2xl rounded-bl-2xl p-2 transition-max-height duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <ul className="flex flex-row w-4/5 justify-between items-center text-gray-600 m-auto p-3 space-y-2">
                    <li>
                        <a href="#home" className="flex items-center hover:underline">
                            <FaHome className='h-6 w-6 mr-1' />
                        </a>
                    </li>
                    <li>
                        <a href="#services" className="flex items-center hover:underline">
                            <FaTools className="h-6 w-6 mr-1" />
                        </a>
                    </li>
                    <li>
                        <a href="#about" className="flex items-center hover:underline">
                            <FaInfoCircle className="h-6 w-6 mr-1" />
                        </a>
                    </li>
                    <li>
                        <a href="#testimonials" className="flex items-center hover:underline">
                            <FaComments className="h-6 w-6 mr-1" />
                        </a>
                    </li>
                    <li>
                        <a href="#contact" className="flex items-center hover:underline">
                            <FaPhone className="h-6 w-6 mr-1" />
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
