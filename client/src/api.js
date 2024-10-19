import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
});

// Function to get the JWT token from local storage
const getToken = () => localStorage.getItem('token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Function to refresh the token
export const refreshToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        console.error("No refresh token found");
        throw new Error("No refresh token found");
    }

    try {
        const response = await apiClient.post('/refresh_token', {}, {
            headers: {
                'Authorization': `Bearer ${refreshToken}`,
            },
        });
        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        return access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        throw error; // Handle the error as needed
    }
};

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            try {
                const newToken = await refreshToken(); // Refresh the token
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Set the new token
                return apiClient(originalRequest); // Retry the original request
            } catch (refreshError) {
                console.error('Failed to refresh token:', refreshError);
                window.location.href = '/login'; // Redirect to login
            }
        }

        return Promise.reject(error);
    }
);

// Login API
export const login = async (email, password) => {
    try {
        const response = await apiClient.post('/login', { email, password });
        const { access_token, refresh_token } = response.data;

        if (access_token) localStorage.setItem('token', access_token);
        if (refresh_token) localStorage.setItem('refresh_token', refresh_token);
        
        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
};

// Logout Function
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirect to login
};

// Authentication Functions
export const signup = async (email, password, username, phone, role, adminCode = null) => {
    const setError = (errorMessage) => {
        throw new Error(errorMessage);
    };

    try {
        const response = await apiClient.post('/signup', {
            email,
            password,
            username,
            phone,
            role,
            admin_code: adminCode,
        });

        // Optionally log the user in automatically
        if (response.data.access_token && response.data.refresh_token) {
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
    } catch (error) {
        console.error('Signup error:', error.response?.data || error.message);
        
        if (error.response) {
            switch (error.response.status) {
                case 400:
                    setError('Please check your input and try again.');
                    break;
                case 409:
                    setError('Email already in use. Please choose another one.');
                    break;
                default:
                    setError('An unexpected error occurred. Please try again.');
            }
        } else {
            setError('Network error. Please check your connection.');
        }

        throw error; // Propagate error if necessary
    }
};

// Function to fetch protected data
export const getProtectedData = async () => {
    try {
        const response = await apiClient.get('/protected_route', {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching protected data:', error.response?.data || error.message);
        throw error; // Propagate error
    }
};

// Service Functions
export const fetchServices = async () => {
    try {
        const response = await apiClient.get('/services'); // Removed Authorization header
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error.response?.data || error.message);
        throw error; // Propagate error
    }
};

// Technician Functions
export const fetchTechnicians = async () => {
    try {
        const response = await apiClient.get('/technicians'); // Removed Authorization header
        return response.data;
    } catch (error) {
        console.error("Error fetching technicians:", error.response?.data || error.message);
        throw error;
    }
};

// Blog Functions
export const fetchBlogs = async () => {
    try {
        const response = await apiClient.get('/blogs'); // Removed Authorization header
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error.response?.data || error.message);
        throw error;
    }
};

export default apiClient;
