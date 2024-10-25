import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import PropTypes from 'prop-types';

const Signout = ({ setUser }) => {
    const navigate = useNavigate();

    const handleSignout = async () => {
        try {
            await axios.post('/https://hrs-app-1.onrender.com/logout');
            setUser(null); 
            navigate('/'); 
        } catch (error) {
            console.error("Signout failed:", error);
        }
    };

    return (
        <button onClick={handleSignout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition">
            Sign Out
        </button>
    );
};

Signout.propTypes = {
    setUser: PropTypes.func.isRequired,
};

export default Signout;
