import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as jwt_decode from 'jwt-decode'; 
import { fetchServices } from '../apiService';

const AuthContext = createContext();

const isTokenExpired = (token) => {
    const decoded = jwt_decode(token);
    return decoded.exp * 1000 < Date.now();
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

    // Example function to fetch services
    const getServices = async () => {
        try {
            const services = await fetchServices();
            return services;
        } catch (error) {
            console.error("Failed to fetch services:", error);
            // Handle error accordingly
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
