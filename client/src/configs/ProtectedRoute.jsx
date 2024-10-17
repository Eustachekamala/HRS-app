import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();

    // Check if the user is authenticated and has the required role
    const hasAccess = isAuthenticated && (!allowedRoles || allowedRoles.includes(user?.role));

    return hasAccess ? element : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
    element: PropTypes.element.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string), // Optional array of roles
};

export default ProtectedRoute;