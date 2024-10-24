import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';
import { fetchServices } from '../api';

export const AuthContext = createContext();

// Utility function to check if the token is expired
const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Treat as expired if there's an error
    }
};

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loginUser = (token) => {
        if (token) {
            const decodedUser = jwtDecode(token);
            setUser(decodedUser); // Ensure decodedUser has role info
            localStorage.setItem('token', token);
        }
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    const validateToken = () => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            setUser(jwtDecode(token)); // Ensure this includes role
        } else {
            logoutUser();
        }
        setLoading(false);
    };

    useEffect(() => {
        validateToken(); // Call the validation function on mount
    }, []);

    const getServices = async () => {
        setLoading(true);
        try {
            const services = await fetchServices();
            return services;
        } catch (error) {
            console.error("Failed to fetch services:", error);
            setError("Could not fetch services.");
            return [];
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, getServices, loading, error }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Custom hook for easier access to the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};