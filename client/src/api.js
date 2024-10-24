import axios from 'axios';
import jwtDecode from 'jwt-decode';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// // Function to get the JWT token from local storage
// const getAccessToken = () => localStorage.getItem('access_token');
// const getRefreshToken = () => localStorage.getItem('refresh_token');

// Function to refresh the token

// export const refreshAccessToken = async () => {
//     const refreshToken = getRefreshToken();
    
//     // Check if the refresh token exists
//     if (!refreshToken) {
//         console.error("No refresh token found");
//         throw new Error("No refresh token found");
//     }

//     try {
//         // Send a request to refresh the access token
//         const response = await apiClient.post('/refresh_token', { token: refreshToken }, {
//             headers: {
//                 'Authorization': `Bearer ${refreshToken}`, // Include the refresh token in the headers
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Extract the new access token from the response
//         const { access_token } = response.data;
//         if (access_token) {
//             // Store the new access token in local storage
//             localStorage.setItem('access_token', access_token);
//             return access_token;
//         } else {
//             throw new Error('Failed to refresh access token.');
//         }
//     } catch (error) {
//         // Log the error message and propagate the error
//         console.error('Error refreshing access token:', error.message);
//         throw error; // Propagate error for handling
//     }
// };
// // Add a response interceptor to handle token refresh
// apiClient.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         // If a 401 error occurs, try to refresh the token
//         if (error.response && error.response.status === 401) {
//             try {
//                 const newToken = await refreshAccessToken(); // Refresh the token
//                 originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Set the new token in the request headers
//                 return apiClient(originalRequest); // Retry the original request
//             } catch (refreshError) {
//                 console.error('Failed to refresh token:', refreshError);
//                 window.location.href = '/login'; // Redirect to login
//             }
//         }

//         return Promise.reject(error); // Reject the promise for any other errors
//     }
// );

// Function to refresh the access token
export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }
    
    try {
        const response = await apiClient.post('/refresh-token', { token: refreshToken });
        const { access_token } = response.data;
        localStorage.setItem('access_token', access_token);
        return access_token;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error; // Handle further in your call
    }
};

// Export API functions
export const login = async (credentials) => {
    try {
        const response = await apiClient.post('/login', credentials);
        const { access_token, refresh_token } = response.data;

        if (!access_token || !refresh_token) {
            throw new Error('Access and refresh tokens not received');
        }

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        return response.data;
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
};

// Export other API functions as needed
export const fetchProtectedData = async () => {
    try {
        const response = await apiClient.get('/protected-data');
        return response.data;
    } catch (error) {
        if (error.response.status === 401) {
            // Token might be expired, attempt to refresh
            await refreshAccessToken();
            // Retry the request
            return fetchProtectedData();
        }
        throw error; // Rethrow if it's another error
    }
};


// Validate and refresh token utility function
// api.js

export const validateAndRefreshToken = async () => {
    const token = getAccessToken();
    if (!token) {
        console.error('No access token found.');
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded.exp < currentTime) {
            console.error('Token has expired. Attempting to refresh...');
            const newToken = await refreshAccessToken(); // Refresh the token
            if (newToken) {
                console.log('Token refreshed successfully.');
                return newToken; // Return the new valid token
            } else {
                console.error('Failed to refresh the token.');
                return null; // Return null if refreshing fails
            }
        }

        console.log('Token is valid.');
        return token; // Return the valid token
    } catch (error) {
        console.error('Token decoding error:', error);
        return null; // Return null on decoding errors
    }
};

// Export other functions as needed
export const otherFunction = () => { /*...*/ };

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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirect to login
};

// Authentication Functions
export const signup = async (email, password, username, phone, role, adminCode = null) => {
    try {
        const response = await apiClient.post('/signup', {
            email,
            password,
            username,
            phone,
            role,
            admin_code: adminCode,
        });

        const { access_token, refresh_token } = response.data;
        if (access_token && refresh_token) {
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
        } else {
            throw new Error('Access and refresh tokens not found in the response.');
        }

    } catch (error) {
        console.error('Signup error:', error.response?.data || error.message);
        throw error; // Propagate error if necessary
    }
};


// Service Functions
export const fetchServices = async () => {
    try {
        const response = await apiClient.get('/services');
        
        // Log the response to verify the structure
        console.log('Fetch services response:', response.data); // Debugging log
        
        // Return services if they exist, otherwise return an empty array
        return response.data.services || [];
    } catch (error) {
        console.error("Error fetching services:", error.response?.data || error.message);
        
        // Propagate the error
        throw error;
    }
};

export const fetchRequests = async (token) => {
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const response = await apiClient.get('/requests', {
            headers: {
                Authorization: `Bearer ${token}`, // Ensure the token is formatted correctly
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching requests:", error.response?.data || error.message);
        throw error; // Rethrow the error for handling in the calling function
    }
};

// Technician Functions
export const fetchTechnicians = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found. Please log in.');
    }

    try {
        const response = await axios.get('https://127.0.0.1:5000/technicians', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data.technicians;
    } catch (error) {
        console.error("Error fetching technicians:", error.response?.data || error.message);
        throw error; // Propagate the error for further handling
    }
};

// Blog Functions
export const fetchBlogs = async () => {
    try {
        const response = await apiClient.get('/blogs');
        return response.data;
    } catch (error) {
        console.error("Error fetching blogs:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchUsers = async () => {
    try {
        const response = await apiClient.get('/customers');
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        throw error;
    }
};

export const fetchPaymentServices = async () => {
    try {
        const response = await apiClient.get('/payment');
        
        if (!response.data) {
            throw new Error('Invalid response structure');
        }

        return response.data; // Return the valid response data
    } catch (error) {
        console.error("Error fetching payment services:", error.response?.data || error.message);
        
        if (error.response) {
            switch (error.response.status) {
                case 500:
                    throw new Error('Internal Server Error: Please try again later.');
                case 401:
                    throw new Error('Unauthorized: Please log in again.');
                default:
                    throw new Error(error.response.data.message || 'An unknown error occurred.');
            }
        }
        
        throw error; // Rethrow the error if it's not an HTTP error
    }
};

export const processPayment = async (token, paymentData) => {
    try {
        const response = await apiClient.post('/payment', paymentData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        throw error; // Propagate the error
    }
};

export const fetchTechnicianRequests = async (token, technicianId) => {
    const response = await axios.get(`http://127.0.0.1:5000/technician_requests/${technicianId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};


export const fetchStatistics = async (token) => {
    const response = await axios.get('http://127.0.0.1:5000/statistic', {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    });
    return response.data;
};



export default apiClient;