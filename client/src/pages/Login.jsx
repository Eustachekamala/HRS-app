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

            if (!data.access_token) {
                throw new Error('No access token returned from login.');
            }

            const token = data.access_token;
            console.log('Access Token:', token);

            const validToken = await validateAndRefreshToken();
            console.log('Valid Token:', validToken);

            if (!validToken) {
                throw new Error('Failed to validate access token.');
            }

            let decoded;
            try {
                decoded = jwtDecode(validToken);
                console.log('Decoded Token:', decoded);
            } catch (error) {
                throw new Error('Failed to decode token: ' + error.message);
            }

            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp < currentTime) {
                throw new Error('Token has expired. Please log in again.');
            }

            if (!data.customers || data.customers.length === 0) {
                throw new Error('No user data returned from the API.');
            }
            
            const user = data.customers[0];
            console.log('User Object:', user);

            if (!user || !user.role) {
                throw new Error('User role is not defined in the response.');
            }

            loginUser(user);
            localStorage.setItem('access_token', validToken);

            const redirectUrl = data.redirect || (user.role === 'admin' ? '/admin-dashboard' : '/services');
            window.location.href = redirectUrl;
        } catch (err) {
            console.error('Login Error:', err);
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
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
                        disabled={loading}
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
