import React, { useState } from 'react';
import { useAuth } from '../configs/AuthContext';
import { login, validateAndRefreshToken } from '../api';
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

        if (!data.customers || data.customers.length === 0) {
            throw new Error('No customer data found in the response.');
        }

        // Use access token from login response
        const token = data.access_token || localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found.');
        }

        // Validate and possibly refresh the token
        const validToken = await validateAndRefreshToken();

        if (!validToken) {
            throw new Error('Failed to validate access token.');
        }

        // Log the token before decoding
        console.log('Token to decode:', validToken);
        
        // Decode the token once
        const decoded = jwtDecode(validToken);
        console.log('Decoded Token:', decoded);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
            throw new Error('Token has expired. Please log in again.');
        }

        const user = data.customers[0];
        console.log('User Object:', user);

        if (!user || !user.role) {
            throw new Error('User role is not defined in the response.');
        }

        // Store user role and navigate accordingly
        loginUser(user);
        localStorage.setItem('access_token', validToken);

        const redirectUrl = data.redirect || (user.role === 'admin' ? '/admin-dashboard' : '/services');
        window.location.href = redirectUrl;
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