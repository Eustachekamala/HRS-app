import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Function to get the JWT token from local storage
const getToken = () => localStorage.getItem('token');

// Fetch services function
export const fetchServices = async () => {
    const token = getToken();

    if (!token) {
        console.error("No token found");
        throw new Error("No token found");
    }

    try {
        const response = await axios.get(`${API_URL}/services`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching services:", error.response?.data || error.message);
        throw error;
    }
};
