// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const loginUser = (userData, token) => {
        setUser(userData);
        setToken(token);
        localStorage.setItem('token', token);  // Store token in local storage
    };

    const logoutUser = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');  // Remove token from local storage
    };

    return (
        <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.element.isRequired,
};

export const useAuth = () => useContext(AuthContext);
