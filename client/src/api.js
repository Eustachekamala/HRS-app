import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const signup = async (email, password, username) => {
    const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        username,
    });
    return response.data;
};

export const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
    });
    return response.data;
};

export const googleLogin = async (googleId, email, username) => {
    const response = await axios.post(`${API_URL}/google-login`, {
        google_id: googleId,
        email,
        username,
    });
    return response.data;
};
