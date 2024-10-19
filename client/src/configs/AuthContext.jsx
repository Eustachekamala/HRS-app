import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as jwt_decode from 'jwt-decode';
import { fetchServices } from '../api';

const AuthContext = createContext();

const isTokenExpired = (token) => {
    try {
        const decoded = jwt_decode(token);
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Treat as expired if there's an error
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserFromToken = (token) => {
        setUser(jwt_decode(token));
        localStorage.setItem('token', token);
    };

    const logoutUser = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            setUser(jwt_decode(token));
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
            // Handle error accordingly, perhaps return null or an empty array
            return [];
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUserFromToken, logoutUser, getServices }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
