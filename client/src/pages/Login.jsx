import React, { useState } from 'react';
import { useAuth } from '../configs/AuthContext';
import { login as apiLogin } from '../api';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateTokenFormat = (token) => {
        console.log('Validate token format:', token);
        if (typeof token !== 'string') return false;
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        try {
            parts.forEach((part) => {
                const padding = '='.repeat((4 - part.length % 4) % 4);
                atob(part.replace(/-/g, '+').replace(/_/g, '/') + padding);
            });
        } catch {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiLogin(formData);
            const { access_token: token } = response;

            console.log('Raw token:', token);

            // Validate token format before decoding
            if (!validateTokenFormat(token)) {
                throw new Error('Invalid token format. Please log in again.');
            }

            // Decode the token to get user role
            let decoded;
            try {
                decoded = jwtDecode(token);
                console.log('Decoded token:', decoded);
            } catch (error) {
                console.error('Token decoding failed:', error);
                throw new Error('Invalid token. Please log in again.');
            }

            // Role-based navigation
            if (decoded.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (decoded.role === 'technician') {
                navigate('/technician-panel');
            } else {
                navigate('/user-panel');
            }

            loginUser(decoded); // Update user context

        } catch (err) {
            console.error('Login process failed:', err);
            setError(err.message || 'Login failed. Please check your credentials and try again.');
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
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <input 
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full focus:outline-none focus:border-blue-500"
                />
                
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full focus:outline-none focus:border-blue-500"
                />
                
                <button 
                    type="submit"
                    className={`bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:transform active:scale-98'}`}
                    disabled={loading}
                >
                    {loading ? (
                        <span className="inline-flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Logging in...
                        </span>
                    ) : 'Login'}
                </button>
                
                <p className="mt-4 text-center text-gray-300">
                    Don&apos;t have an account? 
                    <a href="/signup" className="text-blue-300 hover:underline ml-1">Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Login;