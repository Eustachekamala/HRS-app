// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../configs/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

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
            setError('Invalid email or password. Please try again.');
        }
    };

    const responseGoogle = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;
            const res = await axios.post('/api/auth/google', { idToken: credential });
            const userData = res.data.user;
            login(userData);
            
            // Redirect based on user role
            if (userData.role === 'admin') {
                navigate('/admin/dashboard'); // Redirect to admin dashboard
            } else {
                navigate('/services'); // Redirect to services for regular users
            }
        } catch (error) {
            console.error("Google login failed:", error);
            setError('Google login failed. Please try again.');
        }
    };

    return (
        <div className='flex flex-col text-white justify-center items-center h-screen bg-gray-950'>
            <h1 className="text-2xl font-bold mb-5">Login</h1>
                <form onSubmit={handleSubmit} className="bg-black bg-opacity-90 flex flex-col w-full max-w-md mx-auto p-6 rounded-lg shadow-md">
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
                        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded w-full shadow-md hover:bg-blue-700 transition">
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
                    </div>
                    <p className="mt-4 text-center">
                        <a href="/forgot-password" className="text-blue-300 hover:underline">Forgot Password?</a>
                    </p>
                    <p className="mt-4 text-center text-gray-300">
                        Don&apos;t have an account? 
                        <a href="/signup" className="text-blue-300 hover:underline"> Sign up</a>
                    </p>
                </form>
          </div>
    );
};

export default Login;