import React, { useState } from 'react';
import { useAuth } from '../configs/AuthContext';
import { login } from '../api';
import jwtDecode from 'jwt-decode';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Login = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateTokenFormat = (token) => {
        console.group('Token Validation');
        // Basic checks
        if (typeof token !== 'string') {
            console.error('Token is not a string');
            console.groupEnd();
            return false;
        }
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('Token does not have three parts');
            console.groupEnd();
            return false;
        }
        try {
            parts.forEach((part, index) => {
                const padding = '='.repeat((4 - part.length % 4) % 4);
                atob(part.replace(/-/g, '+').replace(/_/g, '/') + padding);
            });
        } catch (e) {
            console.error('Failed to decode token parts:', e);
            console.groupEnd();
            return false;
        }
        console.log('Token format is valid');
        console.groupEnd();
        return true;
    };

    const decodeToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            console.error('Invalid token specified, error:', error);
            throw new Error('Invalid token specified');
        }
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.group('Login Request');
            console.log('Credentials:', { email: formData.email });

            const response = await login(formData.email, formData.password);
            console.log('Full API Response:', response);

            const token = response.access_token || 
                          response.token || 
                          response.data?.access_token || 
                          response.data?.token;

            console.log('Raw token:', token);

            if (!token) {
                throw new Error('No authentication token received from server');
            }

            if (!validateTokenFormat(token)) {
                throw new Error('Token format is invalid');
            }

            const decoded = decodeToken(token); 

            // Here you can decide the redirection based on the role
            // Assuming 'decoded' contains user info after successful login
            if (decoded.role === 'admin') {
                navigate('/admin-dashboard');
            } else if (decoded.role === 'technician') {
                navigate('/technician-panel');
            } else if (decoded.role === 'user') {
                navigate('/services');
            } else {
                navigate('/login');
            }

            // Optionally store the token or user data as needed
            loginUser(decoded); // If using context for global state

        } catch (err) {
            console.error('Login process failed:', err);// Redirect to technician page
            setError(err.message || 'Login failed. Please check your credentials and try again.');
            localStorage.removeItem('access_token');
        } finally {
            console.groupEnd();
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
                    onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                    required
                    className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full focus:outline-none focus:border-blue-500"
                />
                
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                    required
                    className="border border-gray-300 bg-gray-700 rounded-md p-3 mb-4 w-full focus:outline-none focus:border-blue-500"
                />
                
                <button 
                    type="submit"
                    className={`
                        bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md
                        transition-all duration-200
                        ${loading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-blue-700 active:transform active:scale-98'
                        }
                    `}
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
