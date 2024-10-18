import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Function to get the JWT token from local storage
const getToken = () => localStorage.getItem('token');

// Signup function
export const signup = async (email, password, username, phone) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            email,
            password,
            username,
            phone,
            is_admin: false,
        });

        return response.data;
    } catch (error) {
        console.error('Signup error:', error.response?.data || error.message);
        throw error; // Propagate error for further handling if needed
    }
};

// Login function
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });

        // Store the token if login is successful
        if (response.data.access_token) {
            localStorage.setItem('token', response.data.access_token);
            console.log('Token stored:', response.data.access_token);
        }

        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error; // Propagate error for further handling if needed
    }
};

// Google Login function
export const googleLogin = async (googleId, email, username) => {
    try {
        const response = await axios.post(`${API_URL}/auth/google`, {
            google_id: googleId,
            email,
            username,
        });

        // Store the token in local storage after Google login
        const { access_token } = response.data;
        if (access_token) {
            localStorage.setItem('token', access_token);
        }

        return response.data;
    } catch (error) {
        console.error('Google login error:', error.response?.data || error.message);
        throw error; // Propagate error for further handling if needed
    }
};

export const getProtectedData = async () => {
    try {
        const response = await axios.get(`${API_URL}/protected_route`, {
            headers: {
                'Authorization': `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching protected data:', error.response?.data || error.message);
        throw error; // Propagate error for further handling if needed
    }
};
