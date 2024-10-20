import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode'; // Use the correct import
import { fetchServices } from '../api';

const AuthContext = createContext();

const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token); // Call the function correctly
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Treat as expired if there's an error
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const loginUser = (token) => {
        if (token) {
            const decodedUser = jwtDecode(token); // Correct usage
            setUser(decodedUser);
            localStorage.setItem('token', token);
        }
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            setUser(jwtDecode(token)); // Correct usage
        } else {
            logoutUser();
        }
    }, []);

    const getServices = async () => {
        try {
            const services = await fetchServices();
            return services;
        } catch (error) {
            console.error("Failed to fetch services:", error);
            return [];
        }
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, getServices }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
