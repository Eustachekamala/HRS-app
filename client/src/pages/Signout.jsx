import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const Signout = ({ setUser }) => {
    const history = useHistory();

    const handleSignout = async () => {
        try {
            await axios.post('/api/signout');
            setUser(null); // Clear user state
            history.push('/'); // Redirect to home
        } catch (error) {
            console.error("Signout failed:", error);
        }
    };

    return (
        <button onClick={handleSignout}>Sign Out</button>
    );
};

export default Signout;