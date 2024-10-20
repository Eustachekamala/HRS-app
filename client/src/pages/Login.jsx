import React, { useState } from 'react';
import { useAuth } from '../configs/AuthContext';
import { login } from '../api';
import jwtDecode from 'jwt-decode';

const Login = () => {
    const { loginUser } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const data = await login(email, password);
        console.log('API Response:', JSON.stringify(data, null, 2));

        // Check for customers in the response
        if (!data.customers || data.customers.length === 0) {
            throw new Error('No customer data found in the response.');
        }

        // Extract the access token from the API response
        const token = data.access_token || localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found.');
        }

        // Decode the token
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded);

        // Check expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            console.error('Token has expired');
            // Handle token expiration (e.g., refresh token)
            throw new Error('Token has expired. Please log in again.');
        }

        const user = data.customers[0];
        console.log('User Object:', user);

        if (!user || !user.role) {
            throw new Error('User role is not defined in the response.');
        }

        // Store user role and navigate accordingly
        loginUser(user, user.role);
        localStorage.setItem('access_token', token); // Store token in local storage

        // Use the redirect_url from the API response, if available
        const redirectUrl = data.redirect_url || (user.role === 'admin' ? '/admin-dashboard' : user.role === 'technician' ? '/technician' : '/services');

        window.location.href = redirectUrl; // Redirect to the determined URL
    } catch (err) {
        console.error('Login Error:', err);
        setError(err.message || 'Login failed. Please try again.');
    } finally {
        setLoading(false);
    }
};



    return (
        <div className='flex flex-col text-white justify-center items-center h-screen bg-gray-950'>
            <h1 className="text-2xl font-bold mb-5">Login</h1>
            <form 
                onSubmit={handleSubmit} 
                className="bg-black bg-opacity-90 flex flex-col w-full max-w-md mx-auto p-6 rounded-lg shadow-md"
            >
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full"
                />
                
                <div className='flex flex-col items-center justify-center'>
                    <button 
                        type="submit" 
                        className={`bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md hover:bg-blue-700 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
                
                <p className="mt-4 text-center text-gray-300">
                    Don&apos;t have an account? 
                    <a href="/signup" className="text-blue-300 hover:underline"> Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
