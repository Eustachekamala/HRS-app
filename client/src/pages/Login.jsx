import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../configs/AuthContext'; // Import AuthContext
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Get login function from AuthContext

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error state

        try {
            const response = await axios.post('/api/login', { email, password });
            const userData = response.data.user; // Ensure this includes role info
            login(userData); // Set user in AuthContext
            
            // Redirect based on user role
            if (userData.role === 'admin') {
                navigate('/admin/dashboard'); // Redirect to admin dashboard
            } else {
                navigate('/services'); // Redirect to services for regular users
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError('Invalid email or password. Please try again.'); // Set error message
        }
    };

    const responseGoogle = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse; // Get the credential token from Google response
            const res = await axios.post('/api/auth/google', { idToken: credential }); // Send token to backend for verification
            const userData = res.data.user; // Ensure this includes role info
            login(userData); // Set user in AuthContext
            
            // Redirect based on user role
            if (userData.role === 'admin') {
                navigate('/admin/dashboard'); // Redirect to admin dashboard
            } else {
                navigate('/services'); // Redirect to services for regular users
            }
        } catch (error) {
            console.error("Google login failed:", error);
            setError('Google login failed. Please try again.'); // Set error message
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <form onSubmit={handleSubmit} className="bg-blue-600 p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Login</h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="border border-gray-300 p-3 w-full mb-4 rounded"
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="border border-gray-300 p-3 w-full mb-4 rounded"
                />
                <button type="submit" className="bg-dark-blue text-white px-6 py-3 rounded w-full hover:bg-blue-700 transition">
                    Login
                </button>
                {/* Google Login Button */}
                <div className="mt-4 text-center">
                    <GoogleLogin
                        onSuccess={responseGoogle}
                        onError={() => console.log('Login Failed')}
                        logoAlignment="left"
                        style={{ marginTop: '10px' }}
                    />
                </div>
                <p className="mt-4 text-center">
                    <a href="/forgot-password" className="text-blue-300 hover:underline">Forgot Password?</a>
                </p>
                <p className="mt-4 text-center text-gray-300">
                    Don't have an account? 
                    <a href="/signup" className="text-blue-300 hover:underline"> Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Login;