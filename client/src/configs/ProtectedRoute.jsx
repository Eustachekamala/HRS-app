// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    // Determine the user's role, defaulting to 'user' if user is not defined
    const userRole = user?.role ? 'admin' : 'user';
    const hasAccess = isAuthenticated && (!allowedRoles || allowedRoles.includes(userRole));

    return hasAccess ? element : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string), // Optional array of allowed roles
};

export default ProtectedRoute;