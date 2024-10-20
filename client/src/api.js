import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = 'http://localhost:5000';

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_URL,
});

// Function to get the JWT token from local storage
// Function to get the JWT token from local storage
const getAccessToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');

// Function to refresh the token
export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        console.error("No refresh token found");
        throw new Error("No refresh token found");
    }

    const response = await apiClient.post('/refresh_token', { token: refreshToken });
    const { access_token } = response.data;
    if (access_token) {
        localStorage.setItem('access_token', access_token);
        return access_token;
    } else {
        throw new Error('Failed to refresh access token.');
    }
};

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            try {
                const newToken = await refreshAccessToken(); // Refresh the token
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Set the new token in the request headers
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

        // Ensure tokens are received
        if (!access_token) throw new Error('Access token not received');
        if (!refresh_token) throw new Error('Refresh token not received');

        // Store tokens in local storage
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        return response.data; // Return for further processing
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error; // Propagate error for handling
    }
};

// Validate and refresh token utility function
const validateAndRefreshToken = async () => {
    const token = getAccessToken();
    if (!token) {
        console.error('No access token found.');
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) { // Check if the token has expired
            console.error('Token has expired. Attempting to refresh...');
            return await refreshAccessToken(); // Refresh the token
        }
        if (decoded.nbf && decoded.nbf > currentTime) {
            console.error('Token is not yet valid.');
            throw new Error('Token is not yet valid.');
        }
        return token; // Return the valid token
    } catch (error) {
        console.error('Token decoding error:', error);
        return null;
    }
};

// Function to fetch protected data
export const getProtectedData = async () => {
    const token = await validateAndRefreshToken(); // Validate and possibly refresh the token
    if (!token) return; // Exit if token is not available

    try {
        const response = await apiClient.get('/protected_route', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching protected data:', error.response?.data || error.message);
        throw error; // Propagate original error
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
        const { access_token, refresh_token } = response.data;
        if (access_token && refresh_token) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        } else {
            throw new Error('Access and refresh tokens not found in the response.');
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


// const validateAndRefreshToken = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//         console.error('No access token found.');
//         return null;
//     }
    

//     try {
//         const decoded = jwtDecode(token);
//         const currentTime = Math.floor(Date.now() / 1000);
//         if (decoded.exp < currentTime) { // Check if the token has expired
//             console.error('Token has expired. Attempting to refresh...');
//             return await refreshAccessToken(); // Refresh the token
//         }
//         return token; // Return the valid token
//     } catch (error) {
//         console.error('Token decoding error:', error);
//         return null;
//     }
// };


// // Function to fetch protected data
// export const getProtectedData = async () => {
//     const refreshToken = localStorage.getItem('refresh_token');
//     console.log('Refresh Token:', refreshToken);

//     const token = await validateAndRefreshToken(); // Validate and possibly refresh the token
//     if (!token) return; // Exit if token is not available

//     try {
//         const response = await apiClient.get('/protected_route', {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching protected data:', error.response?.data || error.message);
//         throw error; // Propagate original error
//     }
// };



// Service Functions
export const fetchServices = async () => {
    try {
        const response = await apiClient.get('/services'); // Removed Authorization header
        // const data = await response.json();
        // console.log(data);
        return response.data.technicians || [];
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
